// Get the modal element
var modal = document.getElementById("jobModal");

// Get the <a> element that opens the modal
var postFormLink = document.getElementById("postForm");

// Get the <span> element that closes the modal
var closeBtn = document.getElementById("closeBtn");

// Set the modal to be hidden on page load
window.onload = function () {
  modal.style.display = "none";
};

// When the user clicks the <a> link, open the modal
postFormLink.onclick = function (event) {
  event.preventDefault(); // Prevent the default anchor behavior
  modal.style.display = "flex"; // Show the modal
};

// When the user clicks on <span> (x), close the modal
closeBtn.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
// Get the form element
const jobForm = document.getElementById('jobForm');

// Add event listener to handle form submission
jobForm.addEventListener('submit', async function (event) {
    // Prevent the form from submitting the default way
    event.preventDefault();

    // Get form data
    const formData = {
        company: document.getElementById('company').value,
        job_title: document.getElementById('job_title').value,
        salary: document.getElementById('salary').value,
        location: document.getElementById('location').value,
        category: document.getElementById('category').value,
        work_time: document.getElementById('work_time').value,
        job_description: document.getElementById('job_description').value
    };

    try {
        // Send the form data to the server
        const response = await fetch('http://localhost:3000/jobs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Job posted successfully!');
            // Optionally reset the form after submission
            jobForm.reset();
        } else {
            alert('Error posting job. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error connecting to the server.');
    }
});