// ====================================================
// Import Section
// ====================================================

// Express web framework import kar rahe hai
const express = require("express");

// Router module initialisation
const router = express.Router();

// Feedback controllers file se operations import kar rahe hai
// Ye handlers "controllers/feedbackController.js" file se aa rahe hai
const { submitFeedback, getAllFeedbacks, deleteFeedback } = require("../controllers/feedbackController");

// ====================================================
// Route Declarations Section
//
// Ye routes kis URL context me use honge:
// Inko server.js me app.use("/api/feedback", feedbackRoutes) se mount kiya jayega.
//
// 1. POST /api/feedback
// Kaam: Naya feedback save karne ke liye.
// Kahan se call hoga: user.html ke submit form ke click par.
// Next step: controllers/feedbackController.js ke submitFeedback() me jayega.
//
// 2. GET /api/feedback
// Kaam: Saare feedbacks fetch karne ke liye.
// Kahan se call hoga: admin.html ke page load hone par.
// Next step: controllers/feedbackController.js ke getAllFeedbacks() me jayega.
//
// 3. DELETE /api/feedback/:id
// Kaam: Selected feedback delete karne ke liye.
// Kahan se call hoga: admin.html feedback card delete button.
// Next step: controllers/feedbackController.js ke deleteFeedback() me jayega.
// ====================================================

// Route Mapping
router.post("/", submitFeedback);
router.get("/", getAllFeedbacks);
router.delete("/:id", deleteFeedback);

// ====================================================
// Module Exports Section
// ====================================================
module.exports = router;
