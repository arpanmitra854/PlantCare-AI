import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

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

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const otpInput = document.getElementById("otp");
const otpStep = document.getElementById("otp-step");
const verifyOtpButton = document.getElementById("verify-otp-button");
const resendOtpButton = document.getElementById("resend-otp-button");
const forgotPasswordLink = document.getElementById("forgot-password");
const statusText = document.getElementById("login-status");

let generatedOtp = "";
let loginCandidateEmail = "";
let loginAuthorized = false;

function createOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function updateStatus(message, isError = false) {
    statusText.textContent = message;
    statusText.style.color = isError ? "#9f1239" : "#2f5b46";
}

function finalizeProfileCreation() {
    const pendingProfile = localStorage.getItem("pendingProfileData");
    if (pendingProfile) {
        localStorage.setItem("userProfileData", pendingProfile);
        localStorage.removeItem("pendingProfileData");
    }
    localStorage.setItem("profileCreated", "true");
    localStorage.setItem("userSignedUp", "true");
    localStorage.setItem("hasSignedUp", "true");
}

function startOtpFlow(email) {
    loginCandidateEmail = email;
    generatedOtp = createOtp();
    otpStep.classList.remove("hidden");
    updateStatus(`OTP sent. Use ${generatedOtp} to verify authorization.`);
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        updateStatus("Email and password are required.", true);
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        startOtpFlow(email);
    } catch (error) {
        updateStatus(error.message, true);
    }
});

verifyOtpButton.addEventListener("click", () => {
    const otp = otpInput.value.trim();
    if (!generatedOtp) {
        updateStatus("Please login first to receive an OTP.", true);
        return;
    }
    if (otp !== generatedOtp) {
        updateStatus("Invalid OTP. Please try again.", true);
        return;
    }

    loginAuthorized = true;
    finalizeProfileCreation();
    localStorage.setItem("authorizedEmail", loginCandidateEmail);
    updateStatus("OTP verified. Profile created and authorized successfully.");

    setTimeout(() => {
        if (loginAuthorized) {
            window.location.href = "../indexAfter.html";
        }
    }, 700);
});

resendOtpButton.addEventListener("click", () => {
    if (!loginCandidateEmail) {
        updateStatus("Login with email and password first.", true);
        return;
    }
    generatedOtp = createOtp();
    updateStatus(`A new OTP has been sent. Use ${generatedOtp} to continue.`);
});

forgotPasswordLink.addEventListener("click", async (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();

    if (!email) {
        updateStatus("Enter your email first, then click forgot password.", true);
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        updateStatus("Password reset email sent successfully.");
    } catch (error) {
        updateStatus(error.message, true);
    }
});
