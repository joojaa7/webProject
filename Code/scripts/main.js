console.log("In use.");

import { menusUrl, hamburgersUrl, allergensUrl } from "./variables.js";
import ShoppingCart from "./shoppingCart.js";

const fileInput = document.getElementById("file");
const loginElement = document.getElementsByClassName("login_button")[0];
const loggedElement = document.getElementById("logged");
let user = JSON.parse(localStorage.getItem("user"));
const avatar = document.getElementById("avatar");

document.addEventListener("DOMContentLoaded", async () => {
  try {
    setWeekDates();
    ShoppingCart.loadCart();
    ShoppingCart.updateCartDisplay();
    populateWeeklyMenu();
  } catch (error) {
    console.error("Error in DOMContentLoaded event:", error);
  }
});

function setWeekDates() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = today.getDay();

  const currentWeek = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date(today);
    day.setDate(today.getDate() - dayOfWeek + i + 1);
    return day;
  });

  currentWeek.forEach((date, index) => {
    const dayElement = document.getElementById(`day${index}`);
    dayElement.textContent = formatDate(date);
    if (date.getTime() === today.getTime()) {
      dayElement.classList.add("today");
    } else {
      dayElement.classList.remove("today");
    }
  });
}

function formatDate(date) {
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  return `${day}.${month}.`;
}

async function populateWeeklyMenu() {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const dayIds = [
    "menu-monday",
    "menu-tuesday",
    "menu-wednesday",
    "menu-thursday",
    "menu-friday",
    "menu-saturday",
    "menu-sunday",
  ];

  for (let i = 0; i < days.length; i++) {
    try {
      const day = days[i];
      const dayElement = document.getElementById(`day${i}`);
      const formattedDate = dayElement.textContent;
      const year = new Date().getFullYear();

      const burgerId = await fetchMenuByDate(formattedDate + year);
      if (burgerId) {
        const burgerDetails = await fetchBurgerByID(burgerId);
        updateWeeklyMenuDisplay(burgerDetails, day, burgerId, dayIds[i]);
      } else {
        console.log(`No burger found for ${day}`);
        document
          .getElementById(dayIds[i])
          .querySelector(
            ".item_description"
          ).innerHTML = `<p>No menu available for ${day}.</p>`;
      }
    } catch (error) {
      console.error(`Error fetching menu for ${day}:`, error);
      document
        .getElementById(dayIds[i])
        .querySelector(
          ".item_description"
        ).innerHTML = `<p>Error loading menu for ${day}.</p>`;
    }
  }
}

async function updateWeeklyMenuDisplay(burger, day, burgerId, dayId) {
  const menuEntry = document.getElementById(dayId);

  try {
    const response = await fetch(`${allergensUrl}${burgerId}`);
    if (!response.ok) throw new Error("Failed to fetch allergens");
    const allergens = await response.json();
    const allergenDisplay = allergens.map((a) => a.acronym).join(", ");

    menuEntry.querySelector(
      ".menu_item_image"
    ).src = `http://127.0.0.1:3000/api/v1/${burger[0].filename}`;
    menuEntry.querySelector(".menu_item_image").alt = burger[0].Name;

    menuEntry.querySelector(".item_description").innerHTML = `
      <p>Menu for: ${day}</p>
      <h2>${burger[0].Name}</h2>
      <p>${burger[0].Description}</p>
      <p>${burger[0].Price} €</p>
      <p>Allergens: ${allergenDisplay}</p>
      <button class="add-to-cart-btn" data-id="${
        burger[0].ID
      }" data-burger='${JSON.stringify(burger[0])}'>
          <i class="fas fa-shopping-cart"></i> Add to Cart
      </button>
  </div>`;
  } catch (error) {
    console.error("Error updating weekly menu display:", error);
    menuEntry.querySelector(
      ".item_description"
    ).innerHTML = `<p>Error loading menu details for ${day}.</p>`;
  }
  menuEntry
    .querySelector(".add-to-cart-btn")
    .addEventListener("click", function (e) {
      const burger = JSON.parse(e.target.dataset.burger);
      console.log("burger data:", burger);
      ShoppingCart.addItem({
        id: burger.ID,
        name: burger.Name,
        price: burger.Price,
        quantity: 1,
      });
    });
}

const weekdayButtons = document.getElementsByClassName("weekday_link");

for (let button of weekdayButtons) {
  button.addEventListener("click", async (e) => {
    const selectedDate = e.target.innerText;
    const year = new Date().getFullYear();

    try {
      const burgerId = await fetchMenuByDate(selectedDate + year);
      if (burgerId) {
        const burgerDetails = await fetchBurgerByID(burgerId);

        updateMenuDisplay(burgerDetails, selectedDate, burgerId);
      } else {
        console.log("No burger found for this date");
      }
    } catch (error) {
      console.error("Error fetching menu:", error);
    }

    for (let button of weekdayButtons) {
      button.classList.remove("active");
    }
    e.target.classList.add("active");
  });
}

async function fetchMenuByDate(date) {
  const url = `${menusUrl}${date}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data: " + response.statusText);
    }
    const data = await response.json();
    if (data.length > 0 && data[0].burger_id !== undefined) {
      return data[0].burger_id;
    } else {
      console.error("Burger ID is undefined or data array is empty");
      return null;
    }
  } catch (error) {
    console.error("Error fetching menu by date:", error);
    return null;
  }
}

async function fetchBurgerByID(burgerId) {
  const url = `${hamburgersUrl}/${burgerId}`;

  const response = await fetch(url);
  const burger = await response.json();
  return burger;
}

async function updateMenuDisplay(burger, date, burgerId) {
  const menuItems = document.getElementsByClassName("menu_items")[0];

  try {
    const response = await fetch(`${allergensUrl}${burgerId}`);
    if (!response.ok) throw new Error("Failed to fetch allergens");
    const allergens = await response.json();
    const allergenDisplay = allergens.map((a) => a.acronym).join(", ");

    menuItems.innerHTML = `
  <p>Menu for: ${date}</p>
  <h2>${burger[0].Name}</h2>
  <div class="menu_entry">
      <img src="http://127.0.0.1:3000/api/v1/${burger[0].filename}" alt="${
      burger[0].Name
    }" class="menu_item_image">
      <div class="item_description">
          <p>${burger[0].Description}</p>
          <p>${burger[0].Price} €</p>
          <p>Allergens: ${allergenDisplay}</p>
      </div>
      
      <button class="add-to-cart-btn" data-id="${
        burger[0].ID
      }" data-burger='${JSON.stringify(burger[0])}'>
          <i class="fas fa-shopping-cart"></i> Add to Cart
      </button>
  </div>`;
  } catch (error) {
    console.error("Error fetching allergens:", error);
    menuItems.innerHTML = `<p>Error loading menu details.</p>`;
  }

  menuItems
    .querySelector(".add-to-cart-btn")
    .addEventListener("click", function (e) {
      const burger = JSON.parse(e.target.dataset.burger);
      console.log("burger data:", burger);
      ShoppingCart.addItem({
        id: burger.ID,
        name: burger.Name,
        price: burger.Price,
        quantity: 1,
      });
    });
}

document.getElementById("login").addEventListener("click", function () {
  var loginForm = document.getElementById("loginForm");
  var registerForm = document.getElementById("registerForm");
  if (loginForm.style.display === "none" || loginForm.style.display === "") {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
  } else {
    loginForm.style.display = "none";
  }
});

document.getElementById("register").addEventListener("click", function () {
  var registerForm = document.getElementById("registerForm");
  var loginForm = document.getElementById("loginForm");
  if (
    registerForm.style.display === "none" ||
    registerForm.style.display === ""
  ) {
    registerForm.style.display = "block";
    loginForm.style.display = "none";
  } else {
    registerForm.style.display = "none";
  }
});

document.getElementById("login-apply").addEventListener("click", async (e) => {
  const loginForm = document.getElementById("loginForm");
  const name = document.getElementById("loginUsername").value;
  const pw = document.getElementById("loginPassword").value;

  const loginUser = {
    username: name,
    password: pw,
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginUser),
  };
  try {
    const response = await fetch("http://127.0.0.1:3000/api/v1/auth/", options);
    const json = await response.json();
    if (!json.user) {
      alert(json.error.message);
    } else {
      localStorage.setItem("token", json.token);
      localStorage.setItem("user", JSON.stringify(json.user));
      loginForm.style.display = "none";
      user = JSON.parse(localStorage.getItem("user"));
      avatar.src = user.avatar ? "../" + user.avatar : "../default.jpg";
      toggleLogin(true);
    }
  } catch (error) {
    console.error("Error logging in:", error);
    alert("Error logging in: " + error.message);
  }
});

document.getElementById("logout-button").addEventListener("click", () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("shoppingCart");
  document.getElementById("cart-items").innerHTML = "";
  document.getElementById("total").innerHTML = "Total: 0,00€";
  toggleLogin(false);
});

document
  .getElementById("register-submit-btn")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("Registering user");
    let avatar = null;
    const formData = new FormData();
    const firstName = document.getElementById("firstname").value;
    const lastName = document.getElementById("lastname").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const cardNumber = document.getElementById("cardnumber").value;
    const phoneNumber = document.getElementById("phone-number").value;
    const address = document.getElementById("address").value;
    const email = document.getElementById("email").value;

    if (fileInput.files[0]) {
      avatar = fileInput.files[0].name;
      formData.append("file", fileInput.files[0]);
    }
    formData.append("firstname", firstName);
    formData.append("lastname", lastName);
    formData.append("username", username);
    formData.append("password", password);
    formData.append("cardnumber", cardNumber);
    formData.append("phonenumber", phoneNumber);
    formData.append("address", address);
    formData.append("email", email);
    formData.append("avatar", avatar);

    const options = {
      method: "POST",
      body: formData,
    };
    try {
      const response = await fetch(
        "http://127.0.0.1:3000/api/v1/users/register",
        options
      );
      if (response.ok) {
        console.log("response OK");
        registerForm.style.display = "none";
        const loginUser = {
          username: username,
          password: password,
        };
        const options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginUser),
        };
        const response = await fetch(
          "http://127.0.0.1:3000/api/v1/auth/",
          options
        );
        const json = await response.json();
        if (!json.user) {
          alert(json.error.message);
        } else {
          localStorage.setItem("token", json.token);
          localStorage.setItem("user", JSON.stringify(json.user));
          loginForm.style.display = "none";
          user = JSON.parse(localStorage.getItem("user"));
          document.getElementById("avatar").src = user.avatar
            ? "../" + user.avatar
            : "../default.jpg";
          toggleLogin(true);
        }
      }
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Error registering user: " + error.message);
    }
  });

const toggleLogin = (logged) => {
  loginElement.style.display = logged ? "none" : "block";
  loggedElement.style.display = logged ? "block" : "none";
  avatar.src = logged ? "../" + user.avatar : "../default.jpg";
};

document.getElementById("profile-button").addEventListener("click", () => {
  window.location = "login.html";
});

(async () => {
  console.log("IIFE");
  if (localStorage.getItem("token") && localStorage.getItem("user")) {
    try {
      const options = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(
        "http://127.0.0.1:3000/api/v1/auth/verify",
        options
      );
      console.log(response);
      if (response.ok) {
        toggleLogin(true);
      }
    } catch (e) {
      console.log(e);
    }
  }
})();
