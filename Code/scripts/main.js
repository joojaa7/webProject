console.log("In use.");

import { menusUrl, hamburgersUrl, allergensUrl } from "./variables.js";

const fileInput = document.getElementById("file");
const loginElement = document.getElementsByClassName("login_button")[0];
const loggedElement = document.getElementById("logged");
let user;
const avatar = document.getElementById("avatar");

const date = "02.01.2024"; // Muuta tätä päivämäärää testataksesi eri päivämääriä alla olevasta datasta

const data = [
  {
    Nimi: "Juustohamppari",
    Pvm: "01.01.2024",
    Kuvaus: "Juustohamppari on hyvää",
  },
  {
    Nimi: "Epäjuustohamppari",
    Pvm: "02.01.2024",
    Kuvaus: "Epäjuustohamppari on huonoa",
  },
  {
    Nimi: "Leipäjuustohamppari",
    Pvm: "02.01.2024",
    Kuvaus: "Leipäjuustohamppari on outoa",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  setWeekDates();
});

function setWeekDates() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = today.getDay(); // Get current day of week as a number (0-6, where 0 is Sunday)

  const currentWeek = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date(today);
    day.setDate(today.getDate() - dayOfWeek + i + 1); // Adjust days to align with week start from Monday
    return day;
  });

  currentWeek.forEach((date, index) => {
    const dayElement = document.getElementById(`day${index}`);
    dayElement.textContent = formatDate(date); // Update textContent with formatted date
    if (date.getTime() === today.getTime()) {
      dayElement.classList.add("today"); // Add 'today' class if it's the current date
    } else {
      dayElement.classList.remove("today"); // Remove class if it's not today
    }
  });
}

function formatDate(date) {
  // Pad the month and the day with '0' if they are less than 10
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // +1 because getMonth() returns 0-11
  return `${day}.${month}.`; // Returns 'DD.MM.'
}

const weekdayButtons = document.getElementsByClassName("weekday_link");

// TODO: add error handling for when a burger is not found for the date
for (let button of weekdayButtons) {
  button.addEventListener("click", async (e) => {
    const selectedDate = e.target.innerText;
    //console.log("selectedDate", selectedDate);
    try {
      const burgerId = await fetchMenuByDate(selectedDate + "2024");
      //console.log("burgerId in frontend", burgerId);
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
  //console.log("fetchMenuByDate date", date);
  const url = `${menusUrl}${date}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data: " + response.statusText);
    }
    const data = await response.json();
    //console.log("Full data response:", data);

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
    // Fetch allergen IDs associated with this burger
    const response = await fetch(`${allergensUrl}${burgerId}`);
    if (!response.ok) throw new Error("Failed to fetch allergens");
    const allergens = await response.json(); // This should return an array of allergen acronyms
    console.log("Allergens:", allergens);
    // Generate a string of allergen acronyms to display
    const allergenDisplay = allergens.map((a) => a.acronym).join(", ");

    menuItems.innerHTML = `
      <p>Menu for: ${date}</p>
      <h2>${burger[0].Name}</h2>
      <div class="menu_entry">
          <img src="http://127.0.0.1:3000/api/v1/${burger[0].filename}" alt="${burger[0].Name}" class="menu_item_image">
          <div class="item_description">
              <p>${burger[0].Description}</p>
              <p>${burger[0].Price} €</p>
              <p>Allergens: ${allergenDisplay}</p>
          </div>
          
          <button class="add-to-cart-btn" data-id="${burger[0].ID}">
              <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
      </div>`;
    addCartEventListener();
  } catch (error) {
    console.error("Error fetching allergens:", error);
    menuItems.innerHTML = `<p>Error loading menu details.</p>`;
  }
}

function addCartEventListener() {
  const addToCartBtn = document.getElementsByClassName("add-to-cart-btn")[0];
  addToCartBtn.addEventListener("click", (e) => {
    const burgerId = e.target.getAttribute("data-id");
    console.log("Burger ID:", burgerId);
  });
}

// event listener for login button
document.getElementById("login").addEventListener("click", function () {
  var loginForm = document.getElementById("loginForm");
  var registerForm = document.getElementById("registerForm");
  if (loginForm.style.display === "none" || loginForm.style.display === "") {
    loginForm.style.display = "block";
    registerForm.style.display = "none"; // Hide the register form if login form is shown
  } else {
    loginForm.style.display = "none";
  }
});

// event listener for register button
document.getElementById("register").addEventListener("click", function () {
  var registerForm = document.getElementById("registerForm");
  var loginForm = document.getElementById("loginForm");
  if (
    registerForm.style.display === "none" ||
    registerForm.style.display === ""
  ) {
    registerForm.style.display = "block";
    loginForm.style.display = "none"; // Hide the login form if register form is shown
  } else {
    registerForm.style.display = "none";
  }
});

// login submit
document.getElementById("login-apply").addEventListener("click", async (e) => {
  const loginForm = document.getElementById("loginForm");
  const name = document.getElementById("loginUsername").value;
  const pw = document.getElementById("loginPassword").value;
  console.log(name, pw);
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
  const response = await fetch("http://127.0.0.1:3000/api/v1/auth/", options);
  console.log(response);
  const json = await response.json();
  if (!json.user) {
    alert(json.error.message);
  } else {
    localStorage.setItem("token", json.token);
    localStorage.setItem("user", JSON.stringify(json.user));
    loginForm.style.display = "none";
    user = JSON.parse(localStorage.getItem("user"));
    avatar.src = user.avatar ? "../" + user.avatar : "../default.jpg";
    //avatar.src = user.avatar ? '../default.jpg' : '../default.jpg';
    toggleLogin(true);
    // window.location = 'login.html';
  }
});

// TODO: luo logout nappi

// logout
// document.getElementById('logout_button').addEventListener('click', () => {
//   sessionStorage.removeItem('user')
//   sessionStorage.removeItem('token')
// })

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
    console.log(formData);
    const options = {
      method: "POST",
      body: formData,
    };
    console.log(options);
    const response = await fetch(
      "http://127.0.0.1:3000/api/v1/users/register",
      options
    );
    registerForm.style.display = "none";
    console.log(response);
  });

const toggleLogin = (logged) => {
  loginElement.style.display = logged ? "none" : "block";
  loggedElement.style.display = logged ? "block" : "none";
};

document.getElementById("profile-button").addEventListener("click", () => {
  window.location = "login.html";
});
