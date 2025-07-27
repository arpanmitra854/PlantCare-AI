// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDMdl-ElDF6rVFmPDkMW9kd7H4ASaC53p0",
    authDomain: "ai-plant-disease-detector.firebaseapp.com",
    projectId: "ai-plant-disease-detector",
    storageBucket: "ai-plant-disease-detector.firebasestorage.app",
    messagingSenderId: "92279544525",
    appId: "1:92279544525:web:036d6d21d597eff99be784"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Toggle sign-up forms
const emailSignupBtn = document.getElementById("email-signup-btn");
const phoneSignupBtn = document.getElementById("phone-signup-btn");
const emailSignupForm = document.getElementById("email-signup-form");
const phoneSignupForm = document.getElementById("phone-signup-form");

emailSignupBtn.addEventListener("click", () => {
    emailSignupForm.classList.remove("hidden");
    phoneSignupForm.classList.add("hidden");
});

phoneSignupBtn.addEventListener("click", () => {
    phoneSignupForm.classList.remove("hidden");
    emailSignupForm.classList.add("hidden");
});

// Email sign-up
const signupButton = document.getElementById("signup-button");
const sendOtpButton = document.getElementById("send-otp-button");
const verifyOtpButton = document.getElementById("verify-otp-button");
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (document.activeElement.id === "email" || document.activeElement.id === "password") {
            signupButton.click();
        } else if (document.activeElement.id === "phone") {
            sendOtpButton.click();
        } else if (document.activeElement.id === "otp") {
            verifyOtpButton.click();
        }
    }
});
signupButton.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
            alert("Account created successfully!");
            window.location.href = "../indexafter.html";
        })
        .catch((error) => {
            alert(error.message);
        });
        document.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                signupButton.click();
            }
        });
        
});

// Phone number authentication
const otpSection = document.getElementById("otp-section");
let confirmationResult;

sendOtpButton.addEventListener("click", () => {
    const phoneNumber = document.getElementById("phone").value;
    window.recaptchaVerifier = new RecaptchaVerifier(auth, "send-otp-button", {
        'size': 'invisible'
    });
    
    signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
        .then((result) => {
            confirmationResult = result;
            otpSection.classList.remove("hidden");
        })
        .catch((error) => {
            alert(error.message);
        });
});

verifyOtpButton.addEventListener("click", () => {
    const otp = document.getElementById("otp").value;
    confirmationResult.confirm(otp)
        .then(() => {
            alert("Phone number verified successfully!");
            window.location.href = "../indexafter.html";
        })
        .catch((error) => {
            alert("Invalid OTP. Please try again.");
        });
});
