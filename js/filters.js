document.addEventListener("DOMContentLoaded", function () {
  let selectedCategory = "";
  let selectedWorkTime = "Featured"; // Default to Featured
  let jobsPerPage = 5; // Number of jobs to show per batch
  let currentJobIndex = 0; // Track the index of the current job to display

  // Function to fetch data from the jobs endpoint
  fetch("http://localhost:3000/jobs")
    .then((response) => response.json())
    .then((data) => {
      const categoryCounts = getCategoryCounts(data);
      updateVacancyCounts(categoryCounts);

      setupCategoryFilter(data);
      setupWorkTimeFilter(data);

      // Initial display of first 5 jobs
      displayJobs(data);
      setupSeeMoreButton(data);
    })
    .catch((error) => console.error("Error fetching job data:", error));

  // Function to count job vacancies per category
  function getCategoryCounts(jobs) {
    return jobs.reduce((counts, job) => {
      counts[job.category] = (counts[job.category] || 0) + 1; // Increment count for each category
      return counts;
    }, {});
  }

  // Function to update vacancy counts in the HTML
  function updateVacancyCounts(counts) {
    const categories = [
      "Marketing",
      "Customer Service",
      "Human Resource",
      "Project Management",
      "Business Development",
      "Sales & Communication",
      "Teaching & Education",
      "Design & Creative",
    ];

    categories.forEach((category) => {
      document.getElementById(
        `${category
          .toLowerCase()
          .replace(/ & /g, "-")
          .replace(/ /g, "-")}-vacancy`
      ).textContent = `${counts[category] || 0} Vacancy`;
    });
  }

  // Function to set up event listeners for category filters
  function setupCategoryFilter(data) {
    const categoryLinks = document.querySelectorAll(".cat-item");
    categoryLinks.forEach((link) => {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        selectedCategory = link.getAttribute("data-category");
        resetJobDisplay(); // Reset job index and container
        displayJobs(data); // Show filtered jobs

        document.getElementById("job-listings").scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    });
  }

  // Function to set up event listeners for work time filters
  function setupWorkTimeFilter(data) {
    const workTimeLinks = document.querySelectorAll("[data-work-time]");
    workTimeLinks.forEach((link) => {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        selectedWorkTime = link.getAttribute("data-work-time");
        resetJobDisplay(); // Reset job index and container
        displayJobs(data); // Show filtered jobs
      });
    });
  }

  // Function to display jobs incrementally, 5 at a time
  function displayJobs(jobs) {
    const filteredJobs = filterJobs(jobs);
    const jobListingsContainer = document.getElementById("job-listings");

    // Slice and display jobs incrementally
    const jobsToShow = filteredJobs.slice(
      currentJobIndex,
      currentJobIndex + jobsPerPage
    );
    // Inside the displayJobs function, after appending the jobHTML:
    jobsToShow.forEach((job) => {
      const jobHTML = `
    <div class="job-item p-4 mb-4">
      <div class="row g-4">
        <div class="col-sm-12 col-md-8 d-flex align-items-center">
          <div class="text-start ps-4">
            <h5 class="mb-3">${job.job_title}</h5>
            <span class="text-truncate me-3">
              <i class="fa fa-map-marker-alt text-primary me-2"></i>${job.location}
            </span>
            <span class="text-truncate me-3">
              <i class="far fa-clock text-primary me-2"></i>${job.work_time}
            </span>
            <span class="text-truncate me-0">
              <i class="far fa-money-bill-alt text-primary me-2"></i>${job.salary}$
            </span>
          </div>
        </div>
        <div class="col-sm-12 col-md-4 d-flex flex-column align-items-start align-items-md-end justify-content-center">
          <div class="d-flex mb-3">
            <a class="btn btn-primary" id="apply-btn" href="#">Apply Now</a>
          </div>
          <small class="text-truncate">
            <i class="far fa-calendar-alt text-primary me-2"></i>Date Line: 01 Jan, 2045
          </small>
        </div>
      </div>
    </div>
  `;
      jobListingsContainer.innerHTML += jobHTML; // Append job listings
    });

    // Adding the event listener for the apply button
    document.querySelectorAll("#apply-btn").forEach((button) => {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        this.style.backgroundColor = "#b1ffb5"; // Change the background color
        this.textContent = "Applied"; // Change the text to "Applied"
      });
    });

    currentJobIndex += jobsPerPage; // Increment the job index for the next batch

    // Show or hide the "See More" button based on available jobs
    const seeMoreButton = document.getElementById("see-more");
    if (currentJobIndex >= filteredJobs.length) {
      seeMoreButton.style.display = "none"; // Hide if all jobs are displayed
    } else {
      seeMoreButton.style.display = "block"; // Show if there are more jobs to display
    }
  }

  // Function to filter jobs based on selected category and work time
  function filterJobs(jobs) {
    return jobs.filter((job) => {
      const matchesCategory =
        selectedCategory === "" || job.category === selectedCategory;
      const matchesWorkTime =
        selectedWorkTime === "Featured" || job.work_time === selectedWorkTime;
      return matchesCategory && matchesWorkTime;
    });
  }

  // Function to reset job display (clear container and reset index)
  function resetJobDisplay() {
    currentJobIndex = 0;
    document.getElementById("job-listings").innerHTML = ""; // Clear job listings
  }

  // Function to set up the "See More" button functionality
  function setupSeeMoreButton(data) {
    const seeMoreButton = document.getElementById("see-more");
    seeMoreButton.addEventListener("click", function () {
      displayJobs(data); // Show next 5 jobs
    });
  }
});
