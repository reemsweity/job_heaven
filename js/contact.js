// contact.js
document.querySelector('form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Check for empty fields
    if (!name || !email || !subject || !message) {
        showMessage('Please fill in all fields.', 'danger'); // Show danger message
        return; // Exit the function
    }

    // Create data object
    const formData = {
        name: name,
        email: email,
        subject: subject,
        message: message
    };

    // Send data to JSON server
    try {
        const response = await fetch('http://localhost:3000/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Thank you for reaching out to us! We have received your request and will review it shortly. Our team will get back to you as soon as possible.'); // Show success alert
            // Clear the form fields after submission
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('subject').value = '';
            document.getElementById('message').value = '';
        } else {
            console.error('Failed to send message');
            showMessage('There was a problem sending your message. Please try again later.', 'danger'); // Show danger message
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('There was an error. Please try again later.', 'danger'); // Show danger message
    }
});

// Function to display danger messages
function showMessage(message, type) {
    const alertContainer = document.getElementById('alert-container'); // Get the alert container
    const messageDiv = document.createElement('div');
    messageDiv.className = `alert alert-${type}`; // Set class based on type (danger)
    messageDiv.role = 'alert';
    messageDiv.innerText = message;

    // Clear any existing messages
    alertContainer.innerHTML = ''; // Clear previous messages
    alertContainer.appendChild(messageDiv); // Add the new message to the alert container

    // Remove the message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000); // 5000 milliseconds = 5 seconds
}
