// ====================================================
// Import Section
// ====================================================

// Firebase config file se db (Firestore connection) import kar rahe hai
// Ye hume feedbacks save karne aur query karne me help karega
const { db } = require("../config/firebase");

// ====================================================
// Naya Feedback Save Karne Wala Function (POST API Controller)
//
// Kaam:
// 1. Frontend user.html se feedback message aur user email receive karega.
// 2. Data validate karega (dono field hone zaroori hai).
// 3. Firestore me "feedbacks" collection me naya document add karega.
//
// Ye function kahan se call hoga:
// feedbackRoutes.js ke POST /api/feedback route par call hoga.
//
// Firestore me kya save hoga:
// message: User ka actual feedback text
// userEmail: Feedback dene wale user ki email id
// createdAt: ISO standard formatted date & time string
//
// Success me kya hoga:
// Response status 201 aur success: true send karega.
//
// Error me kya hoga:
// Server error hone par status 500 aur fail response send karega.
// ====================================================
const submitFeedback = async (req, res) => {
  try {
    // 1. Request body se variables nikal rahe hai (Frontend user.html se fetch call ke through aayega)
    const { message, userEmail } = req.body;

    // Validation check: Agar message ya email nahi hai toh error bhejenge
    if (!message || !userEmail) {
      return res.status(400).json({
        success: false,
        message: "Message aur Email dono fields dena zaroori hai!"
      });
    }

    // 2. Feedbacks collection me naya document add kar rahe hai
    const feedbackData = {
      message: message.trim(),
      userEmail: userEmail.trim(),
      createdAt: new Date().toISOString() // Current date/time save karne ke liye
    };

    // Firestore database me collection "feedbacks" me store kar rahe hai
    const docRef = await db.collection("feedbacks").add(feedbackData);

    console.log(`📝 Naya feedback save hua! Document ID: ${docRef.id} (By: ${userEmail})`);

    // Success response bhej rahe hai
    return res.status(201).json({
      success: true,
      message: "Feedback successfully submitted!"
    });

  } catch (error) {
    console.error("❌ Feedback submit karne me error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Feedback save karne me error aayi. Please baad me try kare.",
      error: error.message
    });
  }
};

// ====================================================
// Saare Feedbacks Retrieve Karne Wala Function (GET API Controller)
//
// Kaam:
// Firestore se saare feedbacks read karega aur unhe Newest First (Naya pehle) sort karega.
//
// Ye function kahan se call hoga:
// feedbackRoutes.js ke GET /api/feedback route par (Jab admin page load hoga).
//
// Admin kaise read karega:
// admin.html page load hote hi is API ko fetch() karega, response me array of feedbacks milenge
// jinko browser UI par loops chala kar dynamic dynamic cards ke roop me read karega.
//
// Success me kya hoga:
// Feedbacks array status 200 ke sath send hoga.
// ====================================================
const getAllFeedbacks = async (req, res) => {
  try {
    console.log("🔍 Admin saare feedbacks read kar raha hai...");

    // Firestore "feedbacks" collection se data load kar rahe hai aur "createdAt" ke hisab se descending (naya pehle) sort kar rahe hai
    const feedbackSnapshot = await db.collection("feedbacks")
      .orderBy("createdAt", "desc")
      .get();

    const feedbacksList = [];

    // Saare documents par loop chala kar data process kar rahe hai
    feedbackSnapshot.forEach((doc) => {
      const data = doc.data();
      feedbacksList.push({
        id: doc.id,
        message: data.message,
        userEmail: data.userEmail,
        createdAt: data.createdAt
      });
    });

    // Success response list ke sath return kar rahe hai
    return res.status(200).json({
      success: true,
      count: feedbacksList.length,
      feedbacks: feedbacksList
    });

  } catch (error) {
    console.error("❌ Feedbacks read karne me error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Feedbacks fetch karne me error aayi.",
      error: error.message
    });
  }
};

// ====================================================
// 3. Feedback Delete Karne Wala Function (DELETE /api/feedback/:id)
//
// Kaam:
// Firestore se selected feedback document ko delete karega.
// ====================================================
const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Feedback ID missing hai!"
      });
    }

    console.log(`🗑️ Feedback delete request received for ID: ${id}`);

    const docRef = db.collection("feedbacks").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({
        success: false,
        message: "Feedback document nahi mila!"
      });
    }

    await docRef.delete();

    console.log(`✅ Feedback Document (ID: ${id}) deleted successfully!`);

    return res.status(200).json({
      success: true,
      message: "Feedback ko successfully delete kar diya gaya hai!"
    });

  } catch (error) {
    console.error("❌ Feedback delete karne me error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Feedback delete karne me server error aayi.",
      error: error.message
    });
  }
};

// ====================================================
// Module Exports Section
// ====================================================
module.exports = {
  submitFeedback,
  getAllFeedbacks,
  deleteFeedback
};
