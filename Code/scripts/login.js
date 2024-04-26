"use strict";
import { hamburgersUrl, menusUrl } from "./variables.js";

let user = JSON.parse(localStorage.getItem("user"));
console.log(user);

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("add-burger-form");
  const menu = document.getElementById("update-menu-form");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    await addBurger(form);
  });

  menu.addEventListener("submit", async function (event) {
    event.preventDefault();
    await addMenu();
  });
});

const linksToContentMap = {
  "avatar-link": "avatar-content",
  "bio-link": "bio-content",
  "contact_info-link": "contact_info-content",
  "preferences-link": "preferences-content",
  "order_history-link": "order_history-content",
  "bonus-link": "bonus-content",
  "admin_update_menu-link": "admin-update-menu-content",
  "admin_update_users-link": "admin-update-users-content",
};

// TODO: add functionality to add burger to database

const fetchBurgers = async () => {
  try {
    const response = await fetch(hamburgersUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const burgers = await response.json();
    populateBurgers(burgers);
  } catch (error) {
    console.error("Error fetching burgers:", error);
  }
};

function populateBurgers(burgers) {
  const select = document.getElementById("menu-burger");
  burgers.forEach((burger) => {
    const option = document.createElement("option");
    option.value = burger.ID;
    option.textContent = burger.Name;
    select.appendChild(option);
  });
}

const optionsInput = document.querySelector(".options-input");
let currentVisibleContent = null; // To keep track of the currently displayed content

function updateOptionsInput(contentId) {
  if (currentVisibleContent) {
    currentVisibleContent.style.display = "none"; // Hide current content
  }
  const contentToShow = document.getElementById(contentId);
  if (contentToShow !== currentVisibleContent) {
    contentToShow.style.display = "block"; // Show new content
    currentVisibleContent = contentToShow; // Update the reference to the current content
  } else {
    // If the same content is clicked again, toggle its visibility
    contentToShow.style.display = "none";
    currentVisibleContent = null;
  }
}

async function addBurger(form) {
  const formData = new FormData(form);
  console.log("formData:", formData.entries());

  try {
    const response = await fetch(hamburgersUrl, {
      method: "POST",
      body: formData, // FormData object automatically sets the Content-Type to 'multipart/form-data'
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Success:", result);
      alert("Burger added successfully!");
    } else {
      throw new Error("Failed to add burger: " + response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error adding burger: " + error.message);
  }
}

const addMenu = async () => {
  const burger = document.getElementById("menu-burger").value;
  console.log("burger", burger); // logs burger id (number)

  const date = document.getElementById("menu-date").value; // Date format: YYYY-MM-DD
  console.log("date", date); // logs YYYY-MM-DD

  const formattedDate = convertDateFormat(date);
  console.log("formattedDate", formattedDate); // logs DD.MM.YYYY

  const data = { burger_id: burger, date: formattedDate };

  try {
    const response = await fetch(menusUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to add menu item: " + response.statusText);
    }

    const result = await response.json();
    console.log("Success:", result);
    alert("Menu item added successfully!");
  } catch (error) {
    console.error("Error:", error);
    alert("Error adding menu item: " + error.message);
  }
};

// Helper function to format date
function convertDateFormat(dateStr) {
  if (!dateStr) return null;

  const parts = dateStr.split("-");
  if (parts.length !== 3) {
    throw new Error("Invalid date format. Expected YYYY-MM-DD.");
  }

  const [year, month, day] = parts;

  // Check if the date parts are valid numbers
  if (isNaN(new Date(year, month - 1, day))) {
    throw new Error("Invalid date components.");
  }

  return `${day}.${month}.${year}`;
}

// Attach event listeners to each link
Object.keys(linksToContentMap).forEach((linkId) => {
  const link = document.getElementById(linkId);
  if (link) {
    link.addEventListener("click", function (event) {
      //console.log("link:", link);
      //console.log("linkId:", linkId);
      if (linkId === "admin_update_menu-link") {
        fetchBurgers();
      }
      event.preventDefault(); // Prevent default anchor behavior
      updateOptionsInput(linksToContentMap[linkId]);
    });
  }
});

// DEV only: Simulate a user login
// Role-based display logic
const roleSelector = document.getElementById("roleSelector");
const adminSection = document.getElementById("adminSection");
/*const adminFormUsersField = document.getElementById(
  "admin-update-users-content"
);
const adminFormMenuField = document.getElementById(
  "admin-update-users-content"
);*/

roleSelector.addEventListener("change", () => {
  adminSection.style.display =
    roleSelector.value === "admin" ? "block" : "none";
  //adminFormUsersField.style.display =
  //roleSelector.value === "admin" ? "block" : "none";
  //adminFormMenuField.style.display =
  //  roleSelector.value === "admin" ? "block" : "none";
});

// Initial display check based on selector's default value
adminSection.style.display = roleSelector.value === "admin" ? "block" : "none";

document
  .getElementById("avatar-submit")
  .addEventListener("click", async (e) => {
    const avatarFile = document.querySelector("#avatar-file");
    const inputForm = document.getElementById("avatar-form");
    console.log(e);
    let avatar = null;
    const formData = new FormData();
    if (avatarFile.files[0]) {
      avatar = avatarFile.files[0].name;
      formData.append("file", avatarFile.files[0]);
    } else {
      alert("SELECT FILE");
      return;
    }
    const userData = JSON.parse(localStorage.getItem("user"));
    formData.append("avatar", avatar);
    formData.append("username", userData.username);
    const options = {
      method: "PUT",
      body: formData,
    };
    if (userData.username) {
      const response = await fetch(
        "http://127.0.0.1:3000/api/v1/users/avatar",
        options
      );
      const json = await response.json();
      inputForm.reset();
      if (response.ok) {
        console.log("OK");
        userData.avatar = json.avatar;
        sessionStorage.setItem("user", JSON.stringify(userData));
      } else {
        alert("Log in required.");
      }
    }
  });
