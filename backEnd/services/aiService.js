import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// List of valid categories
const VALID_CATEGORIES = [
  "Interested",
  "Meeting Booked",
  "Not Interested",
  "Spam",
  "Out of Office",
];
const cache = new Map(); // Simple in-memory cache

export const categorizeEmail = async (emailText) => {
  try {
    if (cache.has(emailText)) {
      console.log("⚡ Using Cached Category");
      return cache.get(emailText);
    }
    // console.log("🔑 Using API Key:", process.env.GEMINI_API_KEY); // Debug log
    console.log(`📧 Email: ${emailText.trim().substring(0, 200)}`); // Debug log
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Classify this email into one of these categories:
                        - Interested (User shows interest in the offer or product)
                        - Meeting Booked (User has scheduled or requested a meeting)
                        - Not Interested (User declines offer politely)
                        - Spam (Unwanted promotional or scam email)
                        - Out of Office (User is unavailable or on leave)
                    Reply with only the category name. 
                    Email: "${emailText.trim().substring(0, 2000)}"`;
    // const prompt = `Categorize this email into one of the following: ${VALID_CATEGORIES.join(", ")}. Return only the category name without extra explanation. Email: "${emailText.trim().substring(0, 2000)}"`;
    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    // Extract valid category
    const cleanedCategory =
      VALID_CATEGORIES.find((cat) => response.includes(cat)) || "Out of Office";

    console.log(`📌 Categorized as: ${cleanedCategory}`);
    cache.set(emailText, cleanedCategory); // Cache the response
    return cleanedCategory;
  } catch (error) {
    console.error("❌ Gemini API Error:");
    return "Out of Office"; // Default category on failure
  }
};
