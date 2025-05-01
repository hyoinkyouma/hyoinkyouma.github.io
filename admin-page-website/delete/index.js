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
      const projectItem = document.createElement("div");
      projectItem.className = "collection-item";
      projectItem.innerHTML = `
          <div class="project-item">
            <span class="project-name">${project.name}</span>
            <button class="delete-btn btn-small red darken-2 waves-effect waves-light" 
                    data-project-name="${project.name}">
              <i class="material-icons">delete</i>
            </button>
          </div>
        `;
      projectsContainer.appendChild(projectItem);
    });

    // Add event listeners to delete buttons
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", handleDeleteProject);
    });
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
});
