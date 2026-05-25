// ====================================================
// WorkLink Login Page — JavaScript
//
// Kaam:
// 1. Form submit handle karna
// 2. Backend API se authenticate karna
// 3. Role ke hisab se redirect karna (admin/staff)
// ====================================================

// ====================================================
// DOM Elements — HTML se element references lena
// ====================================================
const loginForm          = document.getElementById("loginForm");
const passwordInput      = document.getElementById("password");
const showPasswordCheckbox = document.getElementById("showPassword");
const alertBox           = document.getElementById("alertBox");

// ====================================================
// SHOW PASSWORD TOGGLE
//
// Kaam: Checkbox tick hone par password visible karta hai
// ====================================================
showPasswordCheckbox.addEventListener("change", () => {
    passwordInput.type = showPasswordCheckbox.checked ? "text" : "password";
});

// ====================================================
// ALERT HELPER — Success ya Error message dikhana
//
// Parameters:
// message = dikhane wala text
// type    = "success" (green) ya "danger" (red)
// ====================================================
const showAlert = (message, type) => {
    alertBox.textContent = message;
    alertBox.className   = `alert alert-${type}`;
    alertBox.style.display = "block";
};

// ====================================================
// FORM SUBMIT HANDLER — Main Login Function
//
// Kaam:
// 1. Email + Password form se read karna
// 2. POST /api/auth/login pe request bhejn
// 3. Response me role check karna
// 4. Admin → admin.html | Staff → user.html redirect
// ====================================================
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Form se values read kar rahe hai
    const email    = document.getElementById("email").value.trim();
    const password = passwordInput.value;

    // Submit button reference
    const submitBtn = loginForm.querySelector("button[type='submit']");

    try {
        // Button disable karo taaki double submit na ho
        submitBtn.disabled     = true;
        submitBtn.textContent  = "Signing in...";
        alertBox.style.display = "none";

        // Backend API pe POST request bhej rahe hai
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        // Response check kar rahe hai
        if (response.ok && data.success) {

            // 1. currentUser ke under JSON object save kar rahe hai (Step 8B requirement)
            localStorage.setItem("currentUser", JSON.stringify(data.user));

            // Backwards compatibility ke liye purana userEmail storage bhi update kar rahe hai
            localStorage.setItem("userEmail", data.user.email);

            const userRole = data.user.role;

            // 2. Role validation & custom redirects
            if (userRole === "admin") {
                showAlert("✓ Admin login successful! Redirecting...", "success");
                setTimeout(() => { window.location.href = "admin.html"; }, 1200);

            } else if (userRole === "user" || userRole === "staff") {
                showAlert("✓ Welcome! Redirecting to your dashboard...", "success");
                setTimeout(() => { window.location.href = "user.html"; }, 1200);

            } else {
                // Default fallback redirection case
                showAlert(`✓ Login successful (Role: ${userRole})`, "success");
                setTimeout(() => { window.location.href = "user.html"; }, 1200);
            }

        } else {
            // Backend se aaya error message dikhao
            showAlert(data.message || "Login failed. Please check your credentials.", "danger");
        }

    } catch (error) {
        console.error("Login error:", error);
        showAlert("Server se connect nahi ho pa raha. Backend chal raha hai?", "danger");
    } finally {
        submitBtn.disabled    = false;
        submitBtn.textContent = "Sign In →";
    }
});
