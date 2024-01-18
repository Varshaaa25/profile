// Mock database using an array for simplicity
let users = [];

function registerUser() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const profilePictureInput = document.getElementById('profilePictureInput');
    const profilePicture = profilePictureInput.files.length > 0 ? URL.createObjectURL(profilePictureInput.files[0]) : '';

    // Simulate saving user data to MongoDB
    const user = { username, email, password, profilePicture };
    users.push(user);

    // Display user profile
    displayUserProfile(user);
}

function displayUserProfile(user) {
    const profileContainer = document.getElementById('profileContainer');
    profileContainer.innerHTML = `
        <h2>Your Profile</h2>

        <!-- Display username and provide option to edit -->
        <h3>Username</h3>
        <p id="displayedUsername">${user.username}</p>
        <button onclick="editProfile('username')">Edit Username</button>

        <!-- New section for profile picture -->
        <h3>Profile Picture</h3>
        <div id="profilePictureContainer" class="profile-picture-circle">
            <img src="${user.profilePicture || 'placeholder.png'}" alt="Profile Picture" id="profilePicture">
            <input type="file" id="profilePictureInput" accept="image/*">
            <button onclick="uploadProfilePicture()">Upload Picture</button>
            <button onclick="editProfile('profilePicture')">Edit Picture</button>
        </div>
    `;
    profileContainer.style.display = 'block';
}

function editProfile(field) {
    const displayedField = document.getElementById(`displayed${capitalizeFirstLetter(field)}`);
    let newValue;

    if (field === 'username') {
        newValue = prompt('Enter new username', displayedField.innerText);
    } else if (field === 'profilePicture') {
        const fileInput = document.getElementById('profilePictureInput');
        const file = fileInput.files[0];
        newValue = file ? URL.createObjectURL(file) : null;
    }

    if (newValue !== null) {
        displayedField.innerText = (field === 'username') ? newValue : 'Uploaded Picture';
        if (field === 'profilePicture') {
            const previewContainer = document.getElementById('profilePicture');
            previewContainer.src = newValue;
        }
    }
}

function uploadProfilePicture() {
    const fileInput = document.getElementById('profilePictureInput');
    const previewContainer = document.getElementById('profilePicture');

    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                // Display the uploaded image as a preview
                previewContainer.src = img.src;
            };
        };

        reader.readAsDataURL(file);
    }
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
