// ====================================================
// Import Section
// ====================================================

// Firebase configuration file se db (Firestore connection) import kar rahe hai
const { db } = require("../config/firebase");

// ====================================================
// 1. Saare Users Load Karne Wala Function (GET /api/users)
//
// Kaam:
// Firestore ke "users" collection se saare users fetch karega aur newest first sort karega.
// ====================================================
const getAllUsers = async (req, res) => {
  try {
    console.log("🔍 Admin saare users load kar raha hai...");

    // Firestore se "users" collection ke records query kar rahe hai (createdAt key ke according order descending)
    const userSnapshot = await db.collection("users")
      .orderBy("createdAt", "desc")
      .get();

    const usersList = [];

    // Har user document par loop chalakar data extract kar rahe hai
    userSnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Timestamp safe handling: agar Firestore Timestamp object hai toh toDate() use karenge
      let createdTime = data.createdAt;
      if (createdTime && typeof createdTime.toDate === "function") {
        createdTime = createdTime.toDate().toISOString();
      }

      usersList.push({
        id: doc.id,
        name: data.name || "N/A",
        email: data.email,
        role: data.role,
        createdAt: createdTime
      });
    });

    // Success response list ke saath return kar rahe hai
    return res.status(200).json({
      success: true,
      count: usersList.length,
      users: usersList
    });

  } catch (error) {
    console.error("❌ Users read karne me error aayi:", error.message);
    return res.status(500).json({
      success: false,
      message: "Users load karne me error aayi.",
      error: error.message
    });
  }
};

// ====================================================
// 2. Naya User Create Karne Wala Function (POST /api/users)
//
// Kaam:
// Frontend se name, email, password, aur role lekar validate karega.
// Fir check karega ki email unique hai ya nahi.
// Uske baad Firestore database me naya user store karega.
// ====================================================
const createUser = async (req, res) => {
  try {
    // Request body se fields extract kar rahe hai (Role dropdown hat gaya hai toh role user automatic default hoga)
    const { name, email, password } = req.body;

    // Validation: Check kar rahe hai ki koi field blank toh nahi hai
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Saare fields (Name, Email, Password) fill karna compulsory hai!"
      });
    }

    const emailTrimmed = email.trim().toLowerCase();

    // unique email validation check in Firestore
    const existingUserQuery = await db.collection("users")
      .where("email", "==", emailTrimmed)
      .limit(1)
      .get();

    // Agar user query empty nahi hai, toh email already database me register hai
    if (!existingUserQuery.empty) {
      return res.status(400).json({
        success: false,
        message: "Yeh email address pehle se register hai! Kripya dusra email use karein."
      });
    }

    // New user database structure design (Role is strictly defaulted to "user")
    const newUserData = {
      name: name.trim(),
      email: emailTrimmed,
      password: password.trim(),
      role: "user", // Strict user role assignment
      createdAt: new Date() // Node date save kar rahe hai jo firestore timestamp me auto-convert ho jayegi
    };

    // Firestore me doc create kar rahe hai
    const docRef = await db.collection("users").add(newUserData);

    console.log(`👤 Naya user account save hua! Document ID: ${docRef.id} (Email: ${emailTrimmed})`);

    // Success response send
    return res.status(201).json({
      success: true,
      message: "Naya user successfully add kar diya gaya hai!"
    });

  } catch (error) {
    console.error("❌ User create karne me error aayi:", error.message);
    return res.status(500).json({
      success: false,
      message: "User add karne me server error aayi.",
      error: error.message
    });
  }
};

// ====================================================
// 3. User Delete Karne Wala Function (DELETE /api/users/:id)
//
// Kaam:
// Admin dashboard se user row delete click hone par, id pass karke document ko firestore se uda dega.
// ====================================================
const deleteUser = async (req, res) => {
  try {
    // URL param se document ID extract kar rahe hai
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID missing hai!"
      });
    }

    console.log(`🗑️ User delete request received for ID: ${id}`);

    // ID verification check: check if document exists before deleting (good coding standard)
    const docRef = db.collection("users").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({
        success: false,
        message: "User document nahi mila! Ho sakta hai pehle hi delete ho gaya ho."
      });
    }

    const userData = docSnap.data();

    // Protection rule: Admin accounts cannot be deleted
    if (userData.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin accounts ko delete nahi kiya ja sakta! Yeh protected hai."
      });
    }

    // Firestore se delete process execute kar rahe hai
    await docRef.delete();

    console.log(`✅ User Document (ID: ${id}) deleted successfully!`);

    return res.status(200).json({
      success: true,
      message: "User account ko successfully delete kar diya gaya hai!"
    });

  } catch (error) {
    console.error("❌ User delete karne me error aayi:", error.message);
    return res.status(500).json({
      success: false,
      message: "User account delete karne me server error aayi.",
      error: error.message
    });
  }
};

// ====================================================
// Module Exports Section
// ====================================================
module.exports = {
  getAllUsers,
  createUser,
  deleteUser
};
