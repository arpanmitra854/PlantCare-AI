document.addEventListener("DOMContentLoaded", function () {
    const publicBaseURL = 'https://verified-liberia-portal-balloon.trycloudflare.com';

    const scanButton = document.getElementById("scan");
    const uploadModal = document.getElementById("uploadModal");
    const closeModal = document.querySelector(".close");
    const scanPlantDropdown = document.getElementById("scanPlant");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    const thisDeviceOption = document.getElementById("thisDevice");
    const predictBtn = document.getElementById("predictBtn");
    const fileInput = document.getElementById("fileInput");

    // Show Modal
    function showUploadModal(event) {
        event.preventDefault();
        uploadModal.style.display = "flex";
        dropdownMenu.style.display = "none";
    }

    scanButton.addEventListener("click", showUploadModal);
    thisDeviceOption.addEventListener("click", showUploadModal);

    // Close Modal
    closeModal.addEventListener("click", () => uploadModal.style.display = "none");
    window.addEventListener("click", (event) => {
        if (event.target === uploadModal) {
            uploadModal.style.display = "none";
        }
    });

    // Toggle Dropdown
    scanPlantDropdown.addEventListener("click", function (event) {
        event.preventDefault();
        dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function (event) {
        if (!scanPlantDropdown.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = "none";
        }
    });

    // Predict and Redirect
    predictBtn.addEventListener("click", async () => {
        if (fileInput.files.length === 0) {
            alert("Please select an image first.");
            return;
        }

        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', file);

        const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });

        try {
            const base64Image = await toBase64(file);

            // Get API Key
            const keyRes = await fetch(`${publicBaseURL}/generate-api-key`, { method: 'POST' });
            const keyData = await keyRes.json();
            const apiKey = keyData.api_key;

            // Predict
            const predictRes = await fetch(`${publicBaseURL}/predict`, {
                method: 'POST',
                headers: { 'api-key': apiKey },
                body: formData
            });

            const result = await predictRes.json();
            result.image_url = base64Image; // Store base64 image

            // Save to sessionStorage
            sessionStorage.setItem("plantPrediction", JSON.stringify(result));

            // Redirect
            window.location.href = "result.html";

        } catch (err) {
            console.error("Prediction failed:", err);
            alert("Something went wrong. Please try again.");
        }
    });
});


//login
let subMenu = document.getElementById("subMenu");
let profileButton = document.querySelector(".profile");

function toggleMenu() {
    subMenu.classList.toggle("open-menu");

    // Check if menu is open and add event listener
    if (subMenu.classList.contains("open-menu")) {
        document.addEventListener("click", closeMenuOutside);
    } else {
        document.removeEventListener("click", closeMenuOutside);
    }
}

function closeMenuOutside(event) {
    // If the clicked area is NOT inside subMenu AND NOT the profile button, close it
    if (!subMenu.contains(event.target) && !profileButton.contains(event.target)) {
        subMenu.classList.remove("open-menu"); // Close menu
        document.removeEventListener("click", closeMenuOutside); // Remove event listener
    }
}    





//log out
document.querySelector(".sub-menu-link a:last-child").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default anchor action

    // Clear session data (profile image, etc.)
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to index.html
    window.location.href = "index.html";
});





//welcme message
document.addEventListener("DOMContentLoaded", function () {
    const signupContainer = document.getElementById("signupContainer");
    const welcomeMessage = document.getElementById("welcomeMessage");
    const modalOverlay = document.querySelector(".modal-overlay");
    const nameInput = document.getElementById("name");
    const nameForm = document.getElementById("nameForm");
    const profileName = document.querySelector(".user-info h2");
    const subMenu = document.getElementById("subMenu");

    // Function to check if user is already signed up
    function isUserSignedUp() {
        const storedName = localStorage.getItem("userName");
        const hasSignedUp = localStorage.getItem("hasSignedUp");
        return storedName && hasSignedUp === "true";
    }

    // Update profile name in the dropdown menu
    function updateProfileName(name) {
        if (profileName) {
            profileName.textContent = name;
        }
    }

    function showSignupModal() {
        console.log("Showing signup modal");
        
        // Remove any pre-existing animations
        modalOverlay.style.animation = "none";
        
        // First display elements
        modalOverlay.style.display = "block";
        signupContainer.style.display = "flex";
        
        // Force reflow before changing properties for animation
        void modalOverlay.offsetWidth;
        
        // Set opacity directly instead of relying on animation
        modalOverlay.style.opacity = "1";
        signupContainer.style.opacity = "1";
    }

    function hideSignupModal() {
        // Fade out the signup container but keep overlay visible
        signupContainer.style.opacity = "0";
        
        // Hide signup after animation completes
        setTimeout(() => {
            signupContainer.style.display = "none";
            // Important: Modal overlay stays visible here
        }, 1000);
    }

    // Modified typewriter effect
    function typeWriterEffect(element, text, speed) {
        let i = 0;
        element.textContent = ""; // Clear any existing content
        
        // Make welcome message visible
        element.style.display = "block";
        element.style.opacity = "1";
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    function showWelcomeMessage(name) {
        console.log("Showing welcome message for:", name);
        
        // Make sure overlay is visible
        if (modalOverlay.style.display !== "block") {
            modalOverlay.style.display = "block";
            modalOverlay.style.opacity = "1";
        }
        
        // Clear any existing animations on the overlay
        modalOverlay.style.animation = "none";
        void modalOverlay.offsetWidth;
        
        const welcomeText = `Welcome, ${name}!`;
        
        // Apply typewriter effect
        typeWriterEffect(welcomeMessage, welcomeText, 100);
        
        // Calculate timing
        const typingTime = welcomeText.length * 100;
        const displayTime = 1000; // 1 seconds display time
        const totalTime = typingTime + displayTime;
        
        // Set timeout to fade out both the welcome message and overlay together
        setTimeout(() => {
            // Fade out both elements
            welcomeMessage.style.opacity = "0";
            modalOverlay.style.opacity = "0";
            
            // Hide both elements after fade completes
            setTimeout(() => {
                welcomeMessage.style.display = "none";
                modalOverlay.style.display = "none";
            }, 1000);
        }, totalTime);
        
        // Set flag that welcome message has been shown
        localStorage.setItem("welcomeShown", "true");
    }

    // Clear console for debugging
    console.clear();
    console.log("DOM loaded, checking user status...");
    
    // First check if we have a stored name and update the profile immediately
    const storedName = localStorage.getItem("userName");
    if (storedName) {
        updateProfileName(storedName);
    }
    
    // Then check if user is already signed up
    if (isUserSignedUp()) {
        console.log("User is already signed up");
        
        // Make sure signup modal is hidden
        signupContainer.style.display = "none";
        
        // Check if welcome message should be shown
        const welcomeShown = localStorage.getItem("welcomeShown");
        const currentSessionSignup = sessionStorage.getItem("currentSessionSignup");
        
        console.log("Welcome shown:", welcomeShown);
        console.log("Current session signup:", currentSessionSignup);
        
        if (welcomeShown !== "true" && !currentSessionSignup) {
            // Get stored name
            console.log("Showing welcome message for existing user:", storedName);
            
            // Short delay before showing welcome
            setTimeout(() => {
                showWelcomeMessage(storedName);
            }, 500);
        } else {
            // Make sure all elements are hidden
            modalOverlay.style.display = "none";
            welcomeMessage.style.display = "none";
        }
    } else {
        // New user - show signup modal
        console.log("New user - showing signup modal");
        setTimeout(() => {
            showSignupModal();
        }, 500);
    }

    // Handle signup form submission
    if (nameForm) {
        nameForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const name = nameInput.value.trim();
            
            if (name) {
                console.log("Form submitted with name:", name);
                
                // Save user info to localStorage
                localStorage.setItem("userName", name);
                localStorage.setItem("hasSignedUp", "true");
                localStorage.setItem("welcomeShown", "false");
                
                // Update the profile name in the dropdown
                updateProfileName(name);
                
                // Mark this session
                sessionStorage.setItem("currentSessionSignup", "true");

                // Hide signup but keep overlay
                hideSignupModal();
                
                // Show welcome message after signup disappears
                setTimeout(() => {
                    console.log("Triggering welcome message after signup");
                    showWelcomeMessage(name);
                }, 500);
            }
        });
    }

    // Toggle submenu function 
    window.toggleMenu = function() {
        subMenu.classList.toggle("open-menu");
    }
    
    // Close submenu when clicking anywhere on the document
    document.addEventListener("click", function(event) {
        // Check if the clicked element is not inside the submenu and not the profile button
        const profileButton = document.querySelector(".profile");
        
        if (!subMenu.contains(event.target) && event.target !== profileButton && !profileButton.contains(event.target)) {
            // If submenu is open, close it
            if (subMenu.classList.contains("open-menu")) {
                subMenu.classList.remove("open-menu");
            }
        }
    });
});


// //DataBase
// import { auth, db } from "./database.js";
// import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// import { updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// // Handle Name Submission After Signup
// document.getElementById("nameForm").addEventListener("submit", async (event) => {
//     event.preventDefault();
//     const name = document.getElementById("name").value.trim();
//     const user = auth.currentUser; // Get the logged-in user

//     if (name && user) {
//         try {
//             // Save name in Firestore under "users" collection
//             await setDoc(doc(db, "users", user.uid), { name: name });

//             // Update Firebase Auth Profile
//             await updateProfile(user, { displayName: name });

//             // Store name locally for quick access
//             localStorage.setItem("userName", name);

//             // Update UI
//             updateProfileUI(name);

//             // Hide the name input modal
//             document.getElementById("signupContainer").style.display = "none";
//             document.querySelector(".modal-overlay").style.display = "none";

//             // Show Welcome Message
//             showWelcomeMessage(name);
//         } catch (error) {
//             console.error("Error saving name:", error);
//         }
//     }
// });


// import { auth, db } from "./database.js";
// import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// // Listen for Authentication State Change
// auth.onAuthStateChanged(async (user) => {
//     if (user) {
//         try {
//             let storedName = localStorage.getItem("userName");

//             if (!storedName) {
//                 // Fetch name from Firestore if not found locally
//                 const docSnap = await getDoc(doc(db, "users", user.uid));
//                 if (docSnap.exists()) {
//                     storedName = docSnap.data().name;
//                     localStorage.setItem("userName", storedName);
//                 }
//             }

//             if (storedName) {
//                 // Update UI
//                 updateProfileUI(storedName);

//                 // Show welcome message if it's a new login session
//                 if (!sessionStorage.getItem("currentSessionLogin")) {
//                     showWelcomeMessage(storedName);
//                     sessionStorage.setItem("currentSessionLogin", "true");
//                 }
//             }
//         } catch (error) {
//             console.error("Error fetching name:", error);
//         }
//     }
// });


// // Function to Update Profile Name in UI
// function updateProfileUI(name) {
//     const profileName = document.querySelector(".user-info h2");
//     if (profileName) {
//         profileName.textContent = name;
//     }
// }

// // Function to Show Welcome Message
// function showWelcomeMessage(name) {
//     const welcomeMessage = document.getElementById("welcomeMessage");
//     if (welcomeMessage) {
//         welcomeMessage.textContent = `Welcome, ${name}!`;
//         welcomeMessage.style.display = "block";

//         // Hide message after 3 seconds
//         setTimeout(() => {
//             welcomeMessage.style.display = "none";
//         }, 3000);
//     }
// }
