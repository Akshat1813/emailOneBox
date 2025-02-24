import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import emailRoutes from "./routes/emailRoutes.js"; // ✅ Ensure correct import
// import cors from "cors";
// ✅ Import the search function


dotenv.config();
connectDB();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();
// app.use(cors()); 
// ✅ Allow requests from frontend
app.use(express.json());  // ✅ Ensure JSON parsing
app.use("/emails", emailRoutes); // ✅ Hook up email routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
