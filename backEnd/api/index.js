import express from "express";
import dotenv from "dotenv";
import connectDB from "../config/db.js"; // Adjust path
import emailRoutes from "../routes/emailRoutes.js";

dotenv.config();

const app = express();
app.use(express.json()); // ✅ Ensure JSON parsing

// ✅ MongoDB must connect inside the request to avoid connection loss
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use("/emails", emailRoutes);

// ✅ Serverless function export
export default app;