// ====================================================
// Import Section
// ====================================================

// Express web framework import kar rahe hai taaki Router use kar sake
const express = require("express");

// Express ka route handler (Router) call kar rahe hai
const router = express.Router();

// Auth controller file se login function import kar rahe hai jisme login logic likha hai
// Ye controller data "controllers/authController.js" file se aa raha hai
const { loginUser } = require("../controllers/authController");

// ====================================================
// Route Declarations Section
//
// Ye routes kis URL context me use honge:
// Inko server.js me app.use("/api/auth", authRoutes) se map kiya jayega.
// Isliye, ye route actual me "POST /api/auth/login" banega.
//
// Ye function kahan se call hoga:
// Jab bhi user login form submit karega ya Postman request aayegi.
//
// Next kis function me jayega:
// Yahan se direct controllers/authController.js ke "loginUser" function me request pass hogi.
// ====================================================

// Login API point: POST request map kar rahe hai
router.post("/login", loginUser);

// ====================================================
// Module Exports Section
// ====================================================

// Router instance ko export kar rahe hai taaki server.js me isko mount (use) kiya ja sake
module.exports = router;
