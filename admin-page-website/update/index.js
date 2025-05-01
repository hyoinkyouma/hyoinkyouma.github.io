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
  } else {
    // Hide project name if it was still there from a previous update
    document.querySelector("h1").textContent = "Upload";
    submitBtn.textContent = "Upload";
  }

  // Set up image preview functionality
  imgInput.addEventListener("input", updateImagePreview);
  imgInput.addEventListener("change", updateImagePreview);
  imgInput.addEventListener("paste", function () {
    // Set a small timeout to let the paste operation complete
    setTimeout(updateImagePreview, 100);
  });

  // Set up image upload functionality
  const imageUploadInput = document.getElementById("image-upload-input");
  imageUploadInput.addEventListener("change", handleImageUpload);
});

// Function to update the image preview
function updateImagePreview() {
  const imageUrl = imgInput.value.trim();
  const previewContainer = document.getElementById("image-preview-container");
  const imagePreview = document.getElementById("image-preview");
  const errorMessage = document.querySelector(".preview-error");

  // Clear previous error
  errorMessage.style.display = "none";

  if (imageUrl) {
    // Show the preview container
    previewContainer.style.display = "block";

    // Set the image source
    imagePreview.src = imageUrl;

    // Handle image load error
    imagePreview.onerror = function () {
      imagePreview.style.display = "none";
      errorMessage.style.display = "block";
    };

    // Handle successful load
    imagePreview.onload = function () {
      imagePreview.style.display = "block";
      errorMessage.style.display = "none";
    };
  } else {
    // Hide the preview if no URL is provided
    previewContainer.style.display = "none";
  }
}

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

    // Update image preview if an image URL is present
    updateImagePreview();

    // Update page title to indicate editing mode
    document.querySelector("h1").textContent = `Edit Project: ${projectName}`;
    submitBtn.textContent = "Update Project";

    // Optionally disable changing the project name to avoid conflicts
    // itemNameInput.disabled = true;

    // Remove loading message
    document.getElementById("loading-message")?.remove();
    updateImagePreview();

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

      // Clear image preview after successful upload
      document.getElementById("image-preview-container").style.display = "none";

      // Reset the page title to "Upload" after successful submission
      document.querySelector("h1").textContent = "Upload";
      submitBtn.textContent = "Upload";
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

// Function to handle image upload
async function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // File validation
  if (!file.type.match("image.*")) {
    M.toast({
      html: "Please select an image file",
      classes: "red",
    });
    return;
  }

  // Create preview of the selected image
  const reader = new FileReader();
  reader.onload = function (e) {
    // Show the image preview
    const previewContainer = document.getElementById("image-preview-container");
    const imagePreview = document.getElementById("image-preview");
    const errorMessage = document.querySelector(".preview-error");

    previewContainer.style.display = "block";
    imagePreview.style.display = "block";
    errorMessage.style.display = "none";
    imagePreview.src = e.target.result;

    M.toast({
      html: "Image selected. Uploading...",
      classes: "blue",
    });

    // Upload the image to the server using the specified endpoint
    uploadImageToServer(file);
  };

  reader.readAsDataURL(file);
}

// Function to upload image to server
async function uploadImageToServer(file) {
  try {
    // Create form data for upload
    const formData = new FormData();
    formData.append("image", file);

    // Upload to the specified endpoint
    const response = await fetch(
      "https://romanaugusto.up.railway.app/v1/upload-project-images",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      // Update the img-input with the returned URL
      document.getElementById("img-input").value = data.link;
      M.updateTextFields();
      M.toast({
        html: "Image uploaded successfully!",
        classes: "green",
      });
    } else {
      throw new Error(data.message || "Upload failed");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    M.toast({
      html: `Upload failed: ${error.message}`,
      classes: "red",
    });
  }
}
