import express from "express";
import { fetchEmails, listenForNewEmails } from "../services/imapService.js";
import { searchEmails } from "../services/elasticService.js"; // ✅ Import the search function

const router = express.Router();

// ✅ Route to manually fetch emails from the last 30 days
router.get("/fetch-emails", async (req, res) => {
  try {
    await fetchEmails();
    res.json({ message: "All previous emails fetched and categorized successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✅ Route for searching emails in Elasticsearch
router.get("/search", searchEmails); // 🔍 Hook up the searchEmails function

// ✅ Start real-time email listening when the server starts (Do NOT expose this in an API)
listenForNewEmails();

export default router;
