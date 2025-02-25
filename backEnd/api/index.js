// import express from "express";
// import connectDB from "../config/db.js"; // ✅ Make sure path is correct
// import emailRoutes from "../routes/emailRoutes.js";
// import dotenv from "dotenv";

// dotenv.config();
// const app = express();
// app.use(express.json());

// // ✅ Only connect to MongoDB when an API request happens
// let isConnected = false;
// const ensureDBConnection = async (req, res, next) => {
//   if (!isConnected) {
//     await connectDB();
//     isConnected = true;
//   }
//   next();
// };

// app.use(ensureDBConnection);
// app.use("/api/emails", emailRoutes);

// // ✅ Test Route
// app.get("/api/test", (req, res) => {
//   res.json({ message: "API is working!" });
// });

// // ✅ Export Express app for Vercel
// export default app;


import express from "express";
import dotenv from "dotenv";
import connectDB from "../config/db.js"; // ✅ Make sure path is correct
import emailRoutes from "../routes/emailRoutes.js"; // ✅ Ensure correct import
import cors from "cors";
// ✅ Import the search function

// ✅ Allow requests from frontend

dotenv.config();
// let isConnected = false;
// const ensureDBConnection = async (req, res, next) => {
//   if (!isConnected) {
//     await connectDB();
//     isConnected = true;
//   }
//   next();
// };
await connectDB();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();
app.use(cors()); 
app.use(express.json());  // ✅ Ensure JSON parsing

app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});

app.use("/api/emails", emailRoutes); // ✅ Hook up email routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
