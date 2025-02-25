import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const VALID_CATEGORIES = [
  "Interested",
  "Meeting Booked",
  "Not Interested",
  "Spam",
  "Out of Office",
];
const cache = new Map();

export const categorizeEmail = async (emailText) => {
  try {
    if (cache.has(emailText)) {
      console.log("Using Cached Category");
      return cache.get(emailText);
    }

    console.log(`Email: ${emailText.trim().substring(0, 200)}`);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Classify this email into one of these categories:
                        - Interested (User shows interest in the offer or product)
                        - Meeting Booked (User has scheduled or requested a meeting)
                        - Not Interested (User declines offer politely)
                        - Spam (Unwanted promotional or scam email)
                        - Out of Office (User is unavailable or on leave)
                    Reply with only the category name. 
                    Email: "${emailText.trim().substring(0, 2000)}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    const cleanedCategory =
      VALID_CATEGORIES.find((cat) => response.includes(cat)) || "Out of Office";

    console.log(`Categorized as: ${cleanedCategory}`);
    cache.set(emailText, cleanedCategory);
    return cleanedCategory;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Out of Office";
  }
};
