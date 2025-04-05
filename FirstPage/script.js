document.addEventListener("DOMContentLoaded", function () {
    const scanButton = document.getElementById("scan"); // "Start Scanning" button
    const uploadModal = document.getElementById("uploadModal"); // Drag & Drop Modal
    const closeModal = document.querySelector(".close"); // Close button
    const scanPlantDropdown = document.getElementById("scanPlant"); // "Scan Plant" dropdown trigger
    const dropdownMenu = document.querySelector(".dropdown-menu"); // Dropdown menu
    const thisDeviceOption = document.getElementById("thisDevice"); // "This Device" in dropdown

    // Function to show Drag & Drop modal
    function showUploadModal(event) {
        event.preventDefault();
        uploadModal.style.display = "flex"; // Show modal
        dropdownMenu.style.display = "none"; // Hide dropdown (if open)
    }

    // Show Drag & Drop Modal when "Start Scanning" is clicked
    scanButton.addEventListener("click", showUploadModal);

    // Show Drag & Drop Modal when "This Device" is clicked in dropdown
    thisDeviceOption.addEventListener("click", showUploadModal);

    // Close modal when clicking 'x' button
    closeModal.addEventListener("click", function () {
        uploadModal.style.display = "none"; // Hide modal
    });

    // Close modal when clicking outside of it
    window.addEventListener("click", function (event) {
        if (event.target === uploadModal) {
            uploadModal.style.display = "none";
        }
    });

    // Toggle dropdown menu when "Scan Plant" is clicked
    scanPlantDropdown.addEventListener("click", function (event) {
        event.preventDefault();
        dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
    });

    // Hide dropdown when clicking outside
    document.addEventListener("click", function (event) {
        if (!scanPlantDropdown.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = "none";
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const navLinks = document.querySelectorAll("nav a"); // Select all navbar links

    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault(); // Stop default navigation
            
            const targetURL = link.getAttribute("href"); // Get the clicked link URL
            
            // Check if the user is signed up (Modify based on your authentication system)
            const isSignedUp = localStorage.getItem("userSignedUp");

            if (!isSignedUp) {
                // Save the intended page in session storage
                sessionStorage.setItem("redirectAfterSignup", targetURL);

                // Redirect to the Signup page
                window.location.href = "Signup/index5.html";
            } else {
                // If already signed up, go directly to the intended page
                window.location.href = targetURL;
            }
        });
    });

    // After the Signup page loads, check if there's a saved page to redirect to
    if (window.location.pathname.includes("Signup/index5.html")) {
        const redirectAfterSignup = sessionStorage.getItem("redirectAfterSignup");

        if (redirectAfterSignup) {
            sessionStorage.removeItem("redirectAfterSignup"); // Clear stored page
            setTimeout(() => {
                window.location.href = redirectAfterSignup; // Redirect to original page
            }, 1000); // Delay for smooth transition
        }
    }
});

