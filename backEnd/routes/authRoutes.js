import express from "express";
import { getAuthURL, getAccessToken } from "../services/oauthService.js";

const router = express.Router();

router.get("/login", (req, res) => {
  res.redirect(getAuthURL());
});

router.get("/callback", async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) {
      return res.status(400).json({ error: "No authorization code provided." });
    }

    const tokens = await getAccessToken(code);
    console.log("✅ OAuth Authentication Successful!");

    res.json({ message: "Authentication successful!", tokens });
  } catch (error) {
    console.error("❌ OAuth Callback Error:", error);
    res.status(500).json({ error: "Failed to get access token." });
  }
});

export default router;
