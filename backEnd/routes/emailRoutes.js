import express from "express";
import { fetchEmails, listenForNewEmails } from "../services/imapService.js";
import { searchEmails } from "../services/elasticService.js";

const router = express.Router();

router.get("/fetch-emails", async (req, res) => {
  try {
    await fetchEmails();
    res.json({ message: "All previous emails fetched and categorized successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/search", searchEmails);

listenForNewEmails();

export default router;
