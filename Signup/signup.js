import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDMdl-ElDF6rVFmPDkMW9kd7H4ASaC53p0",
    authDomain: "ai-plant-disease-detector.firebaseapp.com",
    projectId: "ai-plant-disease-detector",
    storageBucket: "ai-plant-disease-detector.firebasestorage.app",
    messagingSenderId: "92279544525",
    appId: "1:92279544525:web:036d6d21d597eff99be784"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const signupForm = document.getElementById("signup-form");
const signupButton = document.getElementById("signup-button");
const signupStatus = document.getElementById("signup-status");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");
const genderInput = document.getElementById("gender");
const deviceIdInput = document.getElementById("deviceId");

function storeProfileData() {
    const profileData = {
        userName: nameInput.value.trim(),
        userEmail: emailInput.value.trim(),
        userPhone: phoneInput.value.trim(),
        userGender: genderInput.value,
        deviceId: deviceIdInput.value.trim()
    };

    localStorage.setItem("pendingProfileData", JSON.stringify(profileData));
    localStorage.setItem("userEmail", profileData.userEmail);
    localStorage.setItem("profileCreated", "false");
}

signupForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const name = nameInput.value.trim();

    if (!name || !email || !password || !phoneInput.value.trim() || !genderInput.value || !deviceIdInput.value.trim()) {
        signupStatus.textContent = "Please complete all required fields.";
        signupStatus.style.color = "#9f1239";
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            storeProfileData();
            signupStatus.textContent = "Account created. Continue to login for OTP verification.";
            signupStatus.style.color = "#1f5e29";
            setTimeout(() => {
                window.location.href = "../Login/index4.html";
            }, 800);
        })
        .catch((error) => {
            signupStatus.textContent = error.message;
            signupStatus.style.color = "#9f1239";
        });
});
