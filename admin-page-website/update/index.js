const urlUpload = "https://romanaugusto.up.railway.app/v1/sendPortfolio";
const urlGetPortfolio = "https://romanaugusto.up.railway.app/v1/getPortfolio";
const urlRemovePortfolio =
  "https://romanaugusto.up.railway.app/v1/removePortfolio";

document.addEventListener("DOMContentLoaded", function () {
  // Check if user is authenticated
  if (!localStorage.getItem("sessionKey")) {
    window.location.href = "/admin-page-website/";
    return;
  }

  // Fix trailing slash in URL if present and preserve query params
  if (location.pathname.endsWith("/")) {
    const newPath = location.pathname.slice(0, -1);
    const newUrl = newPath + location.search;

    // Use replace to avoid adding to browser history
    history.replaceState(null, "", newUrl);
  }

  // Check for project query parameter and load project data if present
  const urlParams = new URLSearchParams(window.location.search);
  const projectName = urlParams.get("project");

  if (projectName) {
    loadProjectData(projectName);
  }
});

// Function to load project data for editing
async function loadProjectData(projectName) {
  try {
    // Show loading state
    const loadingMessage = document.createElement("div");
    loadingMessage.id = "loading-message";
    loadingMessage.className = "center-align";
    loadingMessage.innerHTML =
      '<div class="progress"><div class="indeterminate"></div></div><p>Loading project data...</p>';
    document.querySelector("#main").prepend(loadingMessage);

    // Fetch the projects data
    const response = await fetch(urlGetPortfolio);
    if (!response.ok) {
      throw new Error("Failed to fetch project data");
    }

    const projectsData = await response.json();

    // Check if project exists
    if (!projectsData[projectName]) {
      throw new Error(`Project "${projectName}" not found`);
    }

    // Populate form fields with project data
    itemNameInput.value = projectName;
    linkInput.value = projectsData[projectName].link || "";
    imgInput.value = projectsData[projectName].img || "";
    descInput.value = projectsData[projectName].desc || "";

    // Update form labels (for Materialize CSS proper display)
    M.updateTextFields();

    // Update page title to indicate editing mode
    document.querySelector("h1").textContent = `Edit Project: ${projectName}`;
    submitBtn.textContent = "Update Project";

    // Optionally disable changing the project name to avoid conflicts
    // itemNameInput.disabled = true;

    // Remove loading message
    document.getElementById("loading-message")?.remove();

    // Show success message
    M.toast({
      html: `Project "${projectName}" loaded for editing`,
      classes: "green",
    });
  } catch (error) {
    console.error("Error loading project data:", error);
    M.toast({
      html: error.message,
      classes: "red",
    });
    document.getElementById("loading-message")?.remove();
  }
}

const logoutBtn = document.getElementById("logoutBtn");
const itemNameInput = document.getElementById("item-input");
const linkInput = document.getElementById("link-input");
const imgInput = document.getElementById("img-input");
const descInput = document.getElementById("desc-input");
const submitBtn = document.getElementById("submitBtn");

// Remove the redeclaration of key since it's already defined in validation.js
// key is already set in validation.js, no need to set it again

logoutBtn.onclick = () => {
  if (confirm("Logging out of admin account.")) {
    localStorage.clear();
    window.location.href = "/admin-page-website";
  }
};

// Check if project exists
async function checkIfProjectExists(projectName) {
  try {
    const response = await fetch(urlGetPortfolio);
    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }

    const projectsData = await response.json();
    return Object.keys(projectsData).includes(projectName);
  } catch (error) {
    console.error("Error checking if project exists:", error);
    return false;
  }
}

// Delete existing project
async function deleteProject(projectName) {
  try {
    const payload = {
      key: key,
      title: projectName,
    };

    const response = await fetch(urlRemovePortfolio, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    // Check for HTTP status code 200 instead of response message
    return response.status === 200;
  } catch (error) {
    console.error("Error deleting project:", error);
    return false;
  }
}

submitBtn.onclick = async () => {
  if (
    imgInput.value == "" ||
    linkInput.value == "" ||
    itemNameInput.value == ""
  ) {
    alert("Fields Empty!");
    return;
  }

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.textContent = "Processing...";

  try {
    // Check if project with same name exists
    const projectExists = await checkIfProjectExists(itemNameInput.value);

    // If it exists, delete it first
    if (projectExists) {
      console.log(
        `Project "${itemNameInput.value}" exists. Deleting before update.`
      );
      const deleteSuccess = await deleteProject(itemNameInput.value);

      if (!deleteSuccess) {
        throw new Error("Failed to delete existing project");
      }
    }

    // Upload new project
    const payload = {
      key: key,
      img: imgInput.value,
      desc: descInput.value,
      link: linkInput.value,
      title: itemNameInput.value,
    };

    const responseData = await fetch(urlUpload, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const response = await responseData.json();
    if (response.Message === "Success") {
      alert("Project Successfully Uploaded!");
      imgInput.value = "";
      descInput.value = "";
      linkInput.value = "";
      itemNameInput.value = "";
      loadProjectData(itemNameInput.value); // Reload project data
    } else {
      alert("Project Upload Failed!");
    }
  } catch (e) {
    console.error("Error:", e);
    alert("Service Error: " + e.message);
  } finally {
    // Reset button state
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
  }
};
