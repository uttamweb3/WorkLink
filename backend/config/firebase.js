// =============================================
// WorkLink - Firebase Configuration (Step 2)
// =============================================

// firebase-admin module ko import kar rahe hai
const admin = require("firebase-admin");

// Service Account Key JSON file ko import kar rahe hai jo config folder mein hai
const serviceAccount = require("./firebase-key.json");

// Firebase initialization state track karne ke liye variable
let db;

try {
  // Service Account credentials ko use karke Firebase Admin SDK initialize kar rahe hai
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("🔥 Firebase Admin initialized successfully!");

  // Firestore Database reference export karne ke liye prepare kar rahe hai
  db = admin.firestore();
} catch (error) {
  console.error("❌ Firebase initialize karne mein error aayi:", error.message);
}

// admin instance aur db connection ko export kar rahe hai taaki baaki app me use ho sake
module.exports = {
  admin,
  db
};
