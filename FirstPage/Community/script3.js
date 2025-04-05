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
        if (uploadModal) {
            uploadModal.style.display = "flex"; // Show modal
        } else {
            console.error("uploadModal not found!");
        }
        dropdownMenu.style.display = "none"; // Hide dropdown (if open)
    }

    // Show Drag & Drop Modal when "Start Scanning" is clicked
    if (scanButton) scanButton.addEventListener("click", showUploadModal);

    // Show Drag & Drop Modal when "This Device" is clicked in dropdown
    if (thisDeviceOption) thisDeviceOption.addEventListener("click", showUploadModal);

    // Close modal when clicking 'x' button
    if (closeModal) closeModal.addEventListener("click", function () {
        uploadModal.style.display = "none"; // Hide modal
    });

    // Close modal when clicking outside of it
    window.addEventListener("click", function (event) {
        if (event.target === uploadModal) {
            uploadModal.style.display = "none";
        }
    });

    // Toggle dropdown menu when "Scan Plant" is clicked
    if (scanPlantDropdown) {
        scanPlantDropdown.addEventListener("click", function (event) {
            event.preventDefault();
            dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
        });
    }

    // Hide dropdown when clicking outside
    document.addEventListener("click", function (event) {
        if (!scanPlantDropdown.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.style.display = "none";
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
    window.location.href = "../index.html";
});