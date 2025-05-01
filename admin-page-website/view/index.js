document.addEventListener("DOMContentLoaded", function () {
  // Check if user is authenticated
  if (!localStorage.getItem("sessionKey")) {
    window.location.href = "/admin-page-website/";
    return;
  }

  // Elements
  const projectsContainer = document.getElementById("projects-container");
  const loadingIndicator = document.getElementById("loading-indicator");
  const noProjectsMessage = document.getElementById("no-projects-message");
  const logoutBtn = document.getElementById("logoutBtn");

  // Logout functionality
  logoutBtn.onclick = () => {
    if (confirm("Logging out of admin account.")) {
      localStorage.clear();
      window.location.href = "/admin-page-website";
    }
  };

  // Get key from localStorage
  const key = localStorage.getItem("sessionKey");

  // Fetch all projects
  fetchProjects();

  // Function to fetch projects from the database
  async function fetchProjects() {
    try {
      // Using the endpoint without token requirement
      const response = await fetch(
        "https://romanaugusto.up.railway.app/v1/getPortfolio"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const projectsData = await response.json();
      displayProjects(projectsData);
    } catch (error) {
      console.error("Error fetching projects:", error);
      showErrorMessage("Failed to load projects. Please try again later.");
    } finally {
      loadingIndicator.style.display = "none";
    }
  }

  // Function to display projects in the UI
  function displayProjects(projectsData) {
    projectsContainer.innerHTML = "";

    if (!projectsData || Object.keys(projectsData).length === 0) {
      noProjectsMessage.style.display = "block";
      return;
    }

    // Convert the object of projects into an array of projects with names
    const projects = Object.entries(projectsData).map(([name, details]) => {
      return {
        name: name,
        link: details.link,
        img: details.img,
        desc: details.desc,
      };
    });

    projects.forEach((project) => {
      const projectCol = document.createElement("div");
      projectCol.className = "col s12 m6 l4";

      // Handle broken images - use new placeholder URL for missing images
      const imageUrl =
        project.img ||
        "https://dummyimage.com/600x400/000/fff.jpg&text=No+Image";

      projectCol.innerHTML = `
        <div class="card project-card">
          <div class="card-image">
            <img src="${imageUrl}" alt="${
        project.name
      }" onerror="this.src='https://dummyimage.com/600x400/000/fff.jpg&text=Error'">
            <span class="card-title">${project.name}</span>
          </div>
          <div class="card-content">
            <p>${project.desc || "No description available."}</p>
          </div>
          <div class="card-action">
            <a href="${project.link}" target="_blank">Visit Project</a>
            <a href="#" class="red-text right delete-btn" 
                   data-project-name="${project.name}" 
                   style="margin-right: 10px;">Delete</a>
            <a href="/admin-page-website/update?project=${encodeURIComponent(
              project.name
            )}" class="right edit-btn" data-project-name="${
        project.name
      }">Edit</a>
          </div>
        </div>
      `;
      projectsContainer.appendChild(projectCol);
    });

    // Add event listeners to delete buttons
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", handleDeleteProject);
    });

    // Add event listeners to edit buttons
    document.querySelectorAll(".edit-btn").forEach((button) => {
      button.addEventListener("click", function (e) {
        // Make sure to prevent the default action which might cause issues
        e.preventDefault();

        const projectName = this.dataset.projectName;
        // Use direct URL without trailing slash to avoid redirect issues
        window.location.href = `/admin-page-website/update?project=${encodeURIComponent(
          projectName
        )}`;
      });
    });

    // Initialize tooltips or other Materialize components if needed
    const elems = document.querySelectorAll(".tooltipped");
    M.Tooltip.init(elems, {});
  }

  // Function to handle project deletion
  async function handleDeleteProject(event) {
    const projectName = event.currentTarget.dataset.projectName;

    if (confirm(`Are you sure you want to delete "${projectName}"?`)) {
      try {
        const payload = {
          key: key,
          title: projectName,
        };

        const response = await fetch(
          "https://romanaugusto.up.railway.app/v1/removePortfolio",
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete project");
        }

        const result = await response.json();

        if (result.Message === "Success") {
          // Show success message
          M.toast({
            html: `Project "${projectName}" deleted successfully!`,
            classes: "green",
          });

          // Refresh the project list
          fetchProjects();
        } else {
          throw new Error(result.Message || "Unknown error occurred");
        }
      } catch (error) {
        console.error("Error deleting project:", error);
        M.toast({
          html: "Failed to delete project. Please try again.",
          classes: "red",
        });
      }
    }
  }

  // Function to show error message
  function showErrorMessage(message) {
    M.toast({ html: message, classes: "red" });
  }

  // Function to go to edit page with project name as parameter
  function editProject(projectName) {
    if (!projectName) return;

    // Make sure we have a clean URL path without trailing slash
    let basePath = "/admin-page-website/update";
    if (basePath.endsWith("/")) {
      basePath = basePath.slice(0, -1);
    }

    // Use window.location.replace to avoid adding to browser history
    // This prevents issues with back button navigation causing multiple redirects
    window.location.replace(
      `${basePath}?project=${encodeURIComponent(projectName)}`
    );
  }

  // Add this function to the edit button click handler
  document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const projectName = this.dataset.projectName;
      editProject(projectName);
    });
  });
});
