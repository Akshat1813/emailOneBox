import express from "express";
import dotenv from "dotenv";
import connectDB from "../config/db.js"; // ✅ Make sure path is correct
import emailRoutes from "../routes/emailRoutes.js"; // ✅ Ensure correct import
import cors from "cors";

dotenv.config();
await connectDB();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/emails", emailRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
