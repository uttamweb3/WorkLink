// ====================================================
// Import Section
// ====================================================

// Firebase config file se db instance le rahe hai
// Ye db instance hume Firestore ke saath data read/write karne me help karega
const { db } = require("../config/firebase");

// ====================================================
// Default Admin Banane Wala Function (Helper)
//
// Kaam:
// 1. Check karega ki users collection me admin@gmail.com hai ya nahi
// 2. Agar nahi hai, toh ek default admin document create karega
//
// Ye function kahan se call hoga:
// server.js se (Server start hote hi automatic run hoga)
// ====================================================
const createDefaultAdmin = async () => {
  try {
    console.log("⚙️ Default admin account check kar rahe hai...");
    
    // Firestore ke "users" collection me se email "admin@gmail.com" ko search kar rahe hai
    const userQuery = await db.collection("users")
      .where("email", "==", "admin@gmail.com")
      .limit(1)
      .get();

    // Agar query snapshot empty hai, iska matlab admin account nahi bana hua hai
    if (userQuery.empty) {
      console.log("📝 Admin nahi mila. Naya default admin create kar rahe hai...");
      
      // Default admin user ka schema data define kar rahe hai
      const defaultAdminData = {
        email: "admin@gmail.com",
        password: "admin123", // Simple plain-text password jaisa requested hai
        role: "admin",
        createdAt: new Date().toISOString()
      };

      // Firestore "users" collection me document add kar rahe hai
      // Doc ID automatic Firebase generate karega
      await db.collection("users").add(defaultAdminData);
      
      console.log("✅ Default admin created successfully (admin@gmail.com / admin123)");
    } else {
      console.log("ℹ️ Default admin account pehle se maujood hai.");
    }
  } catch (error) {
    console.error("❌ Default admin banane me error aayi:", error.message);
  }
};

// ====================================================
// User Login Karne Wala Controller Function
//
// Kaam:
// 1. Frontend ya Postman se bheja hua email aur password receive karega
// 2. Database (Firestore) me is email ka user search karega
// 3. User milne par password check karega (Plain-text comparison)
// 4. Match hone par success response send karega user role ke sath
//
// Ye function kahan se call hoga:
// authRoutes.js ke POST /api/auth/login route ke trigger hone par
//
// Success me kya hoga:
// Response status 200 aur user data send hoga
//
// Error me kya hoga:
// Response status 400 ya 500 error message ke sath return hoga
// ====================================================
const loginUser = async (req, res) => {
  try {
    // Frontend se request body me bheja gaya email aur password extract kar rahe hai
    const { email, password } = req.body;

    // Check kar rahe hai ki kya email ya password me se kuch empty toh nahi hai
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email aur Password dono dena zaroori hai!"
      });
    }

    console.log(`🔑 Login attempt: ${email}`);

    // Firestore me "users" collection ke andar query run kar rahe hai email match karne ke liye
    const userQuery = await db.collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    // Agar userQuery empty hai, iska matlab is email ka koi user database me nahi hai
    if (userQuery.empty) {
      return res.status(400).json({
        success: false,
        message: "User nahi mila! Email galat ho sakta hai."
      });
    }

    // Pehle document ka actual data nikal rahe hai (humne limit 1 lagaya tha)
    const userDoc = userQuery.docs[0];
    const userData = userDoc.data();

    // Password match check kar rahe hai (plain-text strict string match)
    if (userData.password !== password) {
      return res.status(400).json({
        success: false,
        message: "Password galat hai! Kripya sahi password dale."
      });
    }

    // Success response - User detail send kar rahe hai bina password send kiye security ke liye
    return res.status(200).json({
      success: true,
      message: "Login Successful",
      user: {
        id: userDoc.id,
        email: userData.email,
        role: userData.role // Jaise admin ya staff
      }
    });

  } catch (error) {
    // Server backend crash check error
    console.error("❌ Login api controller me error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server me koi error aayi hai. Kuch der baad koshish kare.",
      error: error.message
    });
  }
};

// ====================================================
// Module Exports Section
// ====================================================

// Routes ya server configuration ke liye functions export kar rahe hai
module.exports = {
  createDefaultAdmin,
  loginUser
};
