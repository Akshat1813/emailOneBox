import { categorizeEmail } from "./aiService.js";
import Email from "../models/Email.js";
import imaps from "imap-simple";
import imapConfig from "../config/imapConfig.js";
import { simpleParser } from "mailparser";
import { indexEmail } from "./elasticService.js";
import { sendSlackNotification, triggerWebhook } from "./notificationService.js"; // ✅ Import notification functions

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const processEmails = async (connection, messages) => {
  try {
    console.log(`📩 Processing ${messages.length} new email(s)...`);

    for (const item of messages) {
      const headerPart = item.parts.find((part) => part.which === "HEADER");
      const textPart = item.parts.find((part) => part.which === "TEXT");
      const parsed = textPart ? await simpleParser(textPart.body) : { text: "No Content", html: "No Content" };
      const parsedEmail = {
        sender: headerPart?.body.from?.[0] || "Unknown",
        recipient: process.env.GMAIL_USER,
        subject: headerPart?.body.subject?.[0] || "No Subject",
        // body: textPart ? (await simpleParser(textPart.body)).text : "No Content",
        timestamp: headerPart?.body.date?.[0] ? new Date(headerPart.body.date[0]) : new Date(),
      };
      
      parsedEmail.body = parsed.html || parsed.text; // Store HTML if available, otherwise fallback to plain text
      await delay(5000); // Prevent rate limiting
      parsedEmail.category = await categorizeEmail(parsedEmail.body);

      // ✅ Set folder name as the category name
      parsedEmail.folder = parsedEmail.category;

      await Email.create(parsedEmail);
      await indexEmail(parsedEmail);

      // ✅ Send Slack notification & webhook trigger if category is "Interested"
      if (parsedEmail.category === "Interested") {
        const message = `🚀 *New Interested Email!*  
        *From:* ${parsedEmail.sender}  
        *Subject:* ${parsedEmail.subject}  
        *Body:* ${parsedEmail.body.substring(0, 200)}...`;

        await sendSlackNotification(message);
        await triggerWebhook(parsedEmail.body);
      }
    }

    console.log("✅ Emails Categorized & Stored Successfully!");
  } catch (error) {
    console.error("❌ Error processing emails:", error);
  }
};



// ✅ Function to fetch past 30 days of emails
export const fetchEmails = async () => {
  try {
    console.log("🔄 Connecting to Gmail IMAP...");
    const connection = await imaps.connect(imapConfig());
    console.log("✅ IMAP Connection Established!");

    await connection.openBox("INBOX");
    console.log("📥 Inbox Opened!");

    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - 30); // Fetch last 30 days
    const searchCriteria = [["SINCE", sinceDate.toISOString().split("T")[0]]];

    const fetchOptions = { bodies: ["HEADER", "TEXT"], struct: true };
    const messages = await connection.search(searchCriteria, fetchOptions);

    await processEmails(connection, messages);
    connection.end();
  } catch (error) {
    console.error("❌ Error fetching emails:", error);
    throw new Error(error.message || "Failed to fetch emails.");
  }
};

// ✅ Real-time email synchronization using IMAP IDLE
export const listenForNewEmails = async () => {
  try {
    console.log("🔄 Connecting to Gmail IMAP for real-time updates...");
    const connection = await imaps.connect(imapConfig());
    await connection.openBox("INBOX");
    console.log("✅ Listening for new emails using IMAP IDLE...");

    connection.on("mail", async (numNewMsgs) => {
      console.log(`📩 New Email(s) Detected! (${numNewMsgs})`);
      const searchCriteria = ["NEW"];
      const fetchOptions = { bodies: ["HEADER", "TEXT"], struct: true };
      const messages = await connection.search(searchCriteria, fetchOptions);

      await processEmails(connection, messages);
    });

    connection.on("error", (err) => {
      console.error("❌ IMAP Connection Error:", err);
      setTimeout(listenForNewEmails, 5000); // Restart on error
    });

  } catch (error) {
    console.error("❌ Error in IMAP IDLE Mode:", error);
    setTimeout(listenForNewEmails, 5000); // Retry after 5 sec on failure
  }
};
