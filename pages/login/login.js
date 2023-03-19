import { API_URL } from "../../settings.js";
import { handleHttpErrors } from "../../utils.js";

const URL = API_URL + "/auth/login";

export function initLogin() {
  document.getElementById("login-btn").onclick = login;
}

export function logout() {
  localStorage.clear();
  displayLoginStatus();
}

async function login() {
  document.getElementById("error").innerText = "";
  localStorage.clear();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const userDto = { username, password };

  const options = {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(userDto),
  };

  try {
    const response = await fetch(URL, options).then((res) =>
      handleHttpErrors(res)
    );
    localStorage.setItem("user", response.username);
    localStorage.setItem("token", response.token);
    localStorage.setItem("roles", response.roles);

    displayLoginStatus();
    window.router.navigate("");
  } catch (err) {
    document.getElementById("error").innerText = err.message;
  }
}

// What about a timer to inactive the token and the logged in display?
window.onload = displayLoginStatus;

function displayLoginStatus() {
  const roles = localStorage.getItem("roles");

  if (roles?.includes("ADMIN")) {
    document.querySelector("#admin-only").style.display = "flex";
  }

  const username = localStorage.getItem("user");
  const loginLink = document.getElementById("login-link");
   const signUpLink = document.getElementById("signup-link");

  // Check if the user is logged in
  if (username) {
    document.getElementById("span-id").textContent = username;
    document.getElementById("login-name").style.display = "block";
    document.getElementById("reservations-link").style.display = "block";
    document.getElementById("logout-id").style.display = "block";
    document.getElementById("login-id").style.display = "none";

    // Remove the sign up link from the nav bar
     signUpLink.parentNode.removeChild(signUpLink);
  } else {
    document.getElementById("logout-id").style.display = "none";
    document.getElementById("login-id").style.display = "block";
    document.getElementById("login-name").style.display = "none";
    document.getElementById("signup-link").style.display = "block";
    document.getElementById("reservations-link").style.display = "none";
  }
}
