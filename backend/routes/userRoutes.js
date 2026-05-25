// ====================================================
// Import Section
// ====================================================

// Express web framework import kar rahe hai
const express = require("express");

// Router module init
const router = express.Router();

// User management controller se database actions functions import kar rahe hai
const { getAllUsers, createUser, deleteUser } = require("../controllers/userController");

// ====================================================
// Route Mapping
//
// 1. GET /api/users
// Kaam: Saare registered users fetch karne ke liye (admin.html table loading me kaam aayega)
//
// 2. POST /api/users
// Kaam: Naya user register/add karne ke liye (admin user form submit click handler)
//
// 3. DELETE /api/users/:id
// Kaam: Database se user delete karne ke liye (admin.html delete user click check action)
// ====================================================

router.get("/", getAllUsers);
router.post("/", createUser);
router.delete("/:id", deleteUser);

// Router module ko export kar rahe hai taaki server.js me app.use se mount kar sakein
module.exports = router;
