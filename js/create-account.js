// Handle create account form submission
document.getElementById('createAccountForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const firstName = document.getElementById('firstname').value;
  const lastName = document.getElementById('lastname').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const major = document.getElementById('major').value;
  const phone = document.getElementById('phone').value;
  const cvUrl = document.getElementById('cvUrl').value; // Capture CV URL as a string


  // Validate that passwords match
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return;
  }
  // Validate password (exactly 8 characters, must contain letters and numbers)
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8}$/;
  if (!passwordPattern.test(password)) {
    alert('Password must be exactly 8 characters long and contain both letters and numbers!');
    return;
  }

  // Validate phone number based on city code (assume city code is first 3 digits)
  // const cityCode = phone.substring(0, 3);
  // const validCityCodes = ['123', '456', '789'];  // Example valid city codes
  // if (!validCityCodes.includes(cityCode)) {
  //   alert('Invalid city code!');
  //   return;
  // }

  // Fetch data from JSON server to check if user already exists
  fetch('http://localhost:3000/users')
  .then(response => response.json())
  .then(users => {
    const userExists = users.find(user => user.email === email);
    if (userExists) {
      alert('User already exists, please login.');
    } else {
      const newUser = { 
        firstName, 
        lastName, 
        email, 
        password, 
        major, 
        phone, 
        cvUrl  
      };
    
      fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })
      .then(() => {
        // Automatically redirect to login page after account creation
        window.location.href = "login.html";  // Redirect to login page
      })
      .catch(error => {
        console.error('Error saving user:', error);
        alert('Error saving user. Please try again later.');
      });
    }
  })
  .catch(error => {
    console.error('Error connecting to the server:', error);
    alert('Error connecting to the server. Please try again later.');
  });
});
document.addEventListener('DOMContentLoaded', function() {
  const phoneInput = document.querySelector("#phone");
  
  const iti = window.intlTelInput(phoneInput, {
    initialCountry: "auto",
    geoIpLookup: function(callback) {
      fetch('https://ipinfo.io?token=YOUR_API_KEY')  // Optional: Get the user's country based on IP
        .then(response => response.json())
        .then(data => callback(data.country))
        .catch(() => callback('US'));  // Default to US if geo lookup fails
    },
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",  // For validation and formatting
  });

  // Validate the phone number on form submission
  document.getElementById('createAccountForm').addEventListener('submit', function(event) {
    if (!iti.isValidNumber()) {
      event.preventDefault();  // Prevent form submission if phone number is invalid
    } else {
      // If the phone number is valid, get the full international phone number
      const phoneNumber = iti.getNumber();
      console.log(phoneNumber);  // Use this phone number in form submission
    }
  });
});
