import express from "express";
import connectDB from "../config/db.js";
import emailRoutes from "../routes/emailRoutes.js";
import dotenv from "dotenv";

dotenv.config();
connectDB();

const app = express();
app.use(express.json()); // ✅ Ensure JSON parsing

// ✅ Set up API routes
app.use("/api/emails/", emailRoutes);

app.get("/api/test", (req, res) => {
    res.send("Welcome to the Email Aggregator API!");
    res.json({ message: "API is working!" });
  });

// ✅ Handle root route
app.get("/api/", (req, res) => {
  res.send("Welcome to the Email Aggregator API!");
});

export default app;
