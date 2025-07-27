// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

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

// Toggle sign-in forms
const emailSignInBtn = document.getElementById("email-signup-btn");
const phoneSignInBtn = document.getElementById("phone-signup-btn");
const emailSignInForm = document.getElementById("email-signup-form");
const phoneSignInForm = document.getElementById("phone-signup-form");

emailSignInBtn.addEventListener("click", () => {
    emailSignInForm.classList.remove("hidden");
    phoneSignInForm.classList.add("hidden");
});

phoneSignInBtn.addEventListener("click", () => {
    phoneSignInForm.classList.remove("hidden");
    emailSignInForm.classList.add("hidden");
});

// Email sign-in
const signinButton = document.getElementById("signup-button");
const sendOtpButton = document.getElementById("send-otp-button");
const verifyOtpButton = document.getElementById("verify-otp-button");
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (document.activeElement.id === "email" || document.activeElement.id === "password") {
            signinButton.click();
        } else if (document.activeElement.id === "phone") {
            sendOtpButton.click();
        } else if (document.activeElement.id === "otp") {
            verifyOtpButton.click();
        }
    }
});
signinButton.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Signed in successfully!");
            window.location.href = "../indexafter.html"; // Redirect to another page after login
        })
        .catch((error) => {
            alert(error.message);
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
            alert("Phone number verified and signed in successfully!");
            window.location.href = "../indexafter.html"; // Redirect after successful login
        })
        .catch((error) => {
            alert("Invalid OTP. Please try again.");
        });
});

// Forgot password functionality
const forgotPasswordLink = document.getElementById("forgot-password");

forgotPasswordLink.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default action of the link
    
    const email = document.getElementById("email").value;
    
    if (email) {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert("Password reset email sent successfully!");
            })
            .catch((error) => {
                alert(error.message);
            });
    } else {
        alert("Please enter your email to reset your password.");
    }
});
