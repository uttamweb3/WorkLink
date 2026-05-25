// =============================================
// WorkLink - Backend Server (Step 1)
// =============================================

// Express ko import kar rahe hai - yeh humara web framework hai
const express = require("express");

// CORS ko import kar rahe hai - dusre origins se requests allow karne ke liye
const cors = require("cors");

// dotenv ko import kar rahe hai - .env file se variables load karne ke liye
require("dotenv").config();

// Firebase configuration aur database connection ko import kar rahe hai
const { db } = require("./config/firebase");

// Authentication routes ko import kar rahe hai
// Ye routes "routes/authRoutes.js" file se aa rahe hai
const authRoutes = require("./routes/authRoutes");

// Feedback routes ko import kar rahe hai
// Ye routes "routes/feedbackRoutes.js" file se aa rahe hai
const feedbackRoutes = require("./routes/feedbackRoutes");

// User routes ko import kar rahe hai jo routes/userRoutes.js se aa rahe hai
const userRoutes = require("./routes/userRoutes");

// Auth controller se default admin account banane wala function import kar rahe hai
// Ye function "controllers/authController.js" file se aa raha hai
const { createDefaultAdmin } = require("./controllers/authController");

// =============================================
// App Setup
// =============================================

// Express ka ek naya app bana rahe hai
const app = express();

// Port define kar rahe hai - jahan server chalega
// Agar .env mein PORT hai toh woh use karega, warna 5000
const PORT = process.env.PORT || 5000;

// =============================================
// Middleware (Request ko process karne ke tools)
// =============================================

// CORS enable kar rahe hai - frontend se requests aane dene ke liye
app.use(cors());

// JSON body parse karne ke liye middleware add kar rahe hai
// Isse hum req.body mein JSON data access kar sakte hai
app.use(express.json());

// =============================================
// Routes (API Endpoints)
// =============================================

// Auth Router map kar rahe hai `/api/auth` URL prefix ke sath
// Jab bhi frontend se '/api/auth/...' request aayegi toh router is file pe redirection karega
app.use("/api/auth", authRoutes);

// Feedback Router map kar rahe hai `/api/feedback` URL prefix ke sath
// Jab bhi frontend se feedback write/read requests aayegi toh ye use hoga
app.use("/api/feedback", feedbackRoutes);

// User Router map kar rahe hai `/api/users` URL prefix ke sath
// Admin dashboard se user control operations run karne ke liye
app.use("/api/users", userRoutes);

// Health Check Route - server theek se chal raha hai ya nahi check karne ke liye
// GET /api/health - yeh route check karta hai ki server alive hai
app.get("/api/health", (req, res) => {
  // Response mein success aur message bhej rahe hai
  res.json({
    success: true,
    message: "WorkLink Backend Running",
  });
});

// =============================================
// Server Start Karo
// =============================================

// Server ko PORT par sun-na shuru kar rahe hai (listen)
app.listen(PORT, async () => {
  // Jab server start ho jaaye, console mein print kar do
  console.log(`✅ WorkLink Server chal raha hai: http://localhost:${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);

  // Default admin user check karke auto-create karne ka helper trigger kar rahe hai
  await createDefaultAdmin();
});
