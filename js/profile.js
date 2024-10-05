// Select elements on the profile page
const profilePicture = document.getElementById("profilePicture");
const inputFile = document.getElementById("input-file");
const cvLinkContainer = document.getElementById('cv-link-container');
const cvDownloadButton = document.getElementById('cv-download');
const saveButton = document.getElementById('saveButton');
const editSection = document.getElementById('editSection');

// Get the user ID from localStorage
const userId = localStorage.getItem('userId'); // Assume you stored the userId in localStorage

let currentPassword; // Variable to hold the current password

// Check if the user ID is present in localStorage
if (userId) {
    // Load the user's profile picture from localStorage
    const savedImage = localStorage.getItem('profileImage_' + userId);
    if (savedImage) {
        profilePicture.src = savedImage;
    }

    // Fetch user data based on the ID
    fetch('http://localhost:3000/users/' + userId) // Fixed the endpoint URL to include '/'
        .then(response => {
            if (!response.ok) {
                throw new Error('User ID not found');
            }
            return response.json();
        })
        .then(user => {
            // Store the current password
            currentPassword = user.password;

            // Populate the profile page with user data
            document.getElementById('username').textContent = user.firstName + ' ' + user.lastName;
            document.getElementById('email').textContent = user.email;
            document.getElementById('phone').textContent = user.phone;
            document.getElementById('major').textContent = user.major;

            // Set CV URL if available
            if (user.cvUrl) {
                cvDownloadButton.href = user.cvUrl;
                cvDownloadButton.style.display = 'inline-block';
            }
        })
        .catch(error => console.error('Error fetching user data:', error));
} else {
    console.error('User ID not found in localStorage');
}

// Convert uploaded image file to a Base64 string for profile picture upload
function convertToBase64(file, callback) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        callback(reader.result);
    };
    reader.onerror = function (error) {
        console.log('Error converting image:', error);
    };
}

// Handle image upload
inputFile.addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        convertToBase64(file, function (base64String) {
            profilePicture.src = base64String; // Update profile picture
            localStorage.setItem('profileImage_' + userId, base64String); // Save to localStorage
        });
    }
});

// Save changes in the edit form
saveButton.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form submission

    const currentPasswordInput = document.getElementById('currentPassword').value; // Get the current password from the input
    const fullName = document.getElementById('editName').value.trim();
    const nameParts = fullName.split(' '); // Split the full name into parts
    const firstName = nameParts[0]; // First part is the first name
    const lastName = nameParts.slice(1).join(' '); // Remaining parts as the last name

    // Check if the current password matches
    if (currentPasswordInput !== currentPassword) {
        alert('The current password is incorrect. Please try again.');
        return; // Exit the function if the password does not match
    }

    const updatedUser = {
        firstName: firstName,
        lastName: lastName,
        major: document.getElementById('editMajor').value,
        email: document.getElementById('editEmail').value,
        phone: document.getElementById('editPhone').value,
        password: document.getElementById('newPassword').value,
    };

    fetch('http://localhost:3000/users/' + userId, {
        method: 'PATCH', // Use PATCH to update specific fields
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update user');
        }
        return response.json();
    })
    .then(user => {
        // Update profile fields with new data
        document.getElementById('username').textContent = user.firstName + ' ' + user.lastName;
        document.getElementById('email').textContent = user.email;
        document.getElementById('phone').textContent = user.phone;
        document.getElementById('major').textContent = user.major;

        alert('Profile updated successfully!');
        editSection.style.display = 'none'; // Hide edit form
    })
    .catch(error => console.error('Error updating user data:', error));
});
