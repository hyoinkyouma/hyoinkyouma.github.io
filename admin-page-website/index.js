"use strict";
const loginBtn = document.getElementById("submitBtn");
const form = document.getElementById("login-form");
const link = "https://romanaugusto.up.railway.app/v1/login";
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

// Check if already logged in
document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("sessionKey")) {
    window.location.href = "/admin-page-website/update";
  }
});

loginBtn.onclick = async (e) => {
  e.preventDefault();
  passwordInput.classList.remove("invalid");
  usernameInput.classList.remove("invalid");

  const data = new FormData(form);
  const email = data.get("username");
  const password = data.get("password");
  const json = {
    username: email,
    password: password,
  };

  try {
    const jsonString = JSON.stringify(json);
    const result = await fetch(link, {
      method: "POST",
      body: jsonString,
    });
    const resultJson = await result.json();

    if (resultJson.username == "valid") {
      if (resultJson.password == "valid") {
        // Store session key
        const sessionKey = resultJson.key;
        localStorage.setItem("sessionKey", sessionKey);
        localStorage.setItem("username", json.username);
        window.location.href = "/admin-page-website/update";
      } else {
        passwordInput.classList.add("invalid");
      }
    } else {
      usernameInput.classList.add("invalid");
      passwordInput.classList.add("invalid");
    }
  } catch (e) {
    console.error("Error:", e);
    alert("Server Error.");
  }
};
