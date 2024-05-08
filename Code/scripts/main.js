console.log("In use.");

import {
  menusUrl,
  hamburgersUrl,
  allergensUrl,
  specialOffersUrl,
  ordersUrl,
  joinOrderUrl,
} from "./variables.js";
import ShoppingCart from "./shoppingCart.js";

const fileInput = document.getElementById("file");
const loginElement = document.getElementsByClassName("login_button")[0];
const loggedElement = document.getElementById("logged");
let user = JSON.parse(localStorage.getItem("user"));
const avatar = document.getElementById("avatar");
//const baseUrl = 'http://127.0.0.1:3001/';
const baseUrl = "http://10.120.32.51/web/";

// En tiedä tarvitaanko, kun script tagissa on defer. Kokeilin ilman ja toimi.
document.addEventListener("DOMContentLoaded", async () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser) {
    ShoppingCart.setUserId(storedUser.username);
  } else {
    ShoppingCart.setUserId(null);
  }
  setWeekDates();
  ShoppingCart.loadCart();
  //ShoppingCart.updateCartDisplay();
  populateWeeklyMenu();
  fetchAndDisplayOffers();
  updateButtonVisibility();
});

document
  .getElementById("checkout-button")
  .addEventListener("click", function () {
    populateModalCart();
    document.getElementById("checkout-modal").style.display = "flex";
  });

document.querySelector(".close-button").addEventListener("click", function () {
  document.getElementById("checkout-modal").style.display = "none";
});

document
  .getElementById("confirm-order-button")
  .addEventListener("click", async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user")); // Retrieve user info from local storage
      if (!user) throw new Error("No user logged in");

      const orderResponse = await sendOrder(user.user_id);
      const items = ShoppingCart.items;

      await sendJoinOrder(orderResponse, items);
      ShoppingCart.clearCart();

      document.getElementById("checkout-modal").style.display = "none";
      alert("Order placed successfully!");
      console.log("Order Response:", orderResponse);
    } catch (error) {
      alert("Failed to place order: " + error.message);
      console.error("Order error:", error);
    }
  });

async function sendOrder(user_id) {
  const orderDetails = { user_id };

  try {
    const response = await fetch(ordersUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(orderDetails),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to send order: ${errorData.message}`);
    }

    const result = await response.json();
    return result.order_id;
  } catch (error) {
    console.error("Error sending order:", error.message);
    throw error;
  }
}

async function sendJoinOrder(orderId, items) {
  const orderItemsDetails = {
    orderId,
    items, // Assuming items is an array of { id: burgerId, quantity }
  };

  try {
    const response = await fetch(joinOrderUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(orderItemsDetails),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to link order items: ${errorData.message}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error linking order items:", error.message);
    throw error;
  }
}

function updateButtonVisibility() {
  const isLoggedIn = Boolean(
    localStorage.getItem("user") && localStorage.getItem("token")
  );
  console.log("Updating button visibility, logged in:", isLoggedIn);
  Array.from(document.getElementsByClassName("add-to-cart-btn")).forEach(
    (btn) => {
      btn.style.display = isLoggedIn ? "block" : "none";
    }
  );
}

function populateModalCart() {
  const user = JSON.parse(localStorage.getItem("user"));
  const cartItems = ShoppingCart.items;
  const modalCartItems = document.getElementById("modal-cart-items");
  modalCartItems.innerHTML = ""; // Clear previous items

  document.getElementById("modal-user-name").textContent =
    user.firstname + " " + user.lastname || "N/A";
  document.getElementById("modal-user-address").textContent =
    user.address || "N/A";
  document.getElementById("modal-user-phone").textContent = user.phone || "N/A";
  document.getElementById("modal-user-email").textContent = user.email || "N/A";

  cartItems.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - ${item.price}€ x ${item.quantity}`;
    modalCartItems.appendChild(li);
  });

  document.getElementById("modal-cart-total").textContent =
    ShoppingCart.getTotalPrice();
}

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

  days.forEach(async (day, index) => {
    const dayElement = document.getElementById(`day${index}`);
    const formattedDate = dayElement.textContent;
    const year = new Date().getFullYear();

    try {
      const burgerId = await fetchMenuByDates(formattedDate + year);
      if (burgerId) {
        const burgerDetails = await fetchBurgerByID(burgerId);
        updateWeeklyMenuDisplay(burgerDetails, day, burgerId, dayIds[index]);
      } else {
        console.log(`No burger found for ${day}`);
        document
          .getElementById(dayIds[index])
          .querySelector(
            ".item_description"
          ).innerHTML = `<p>No menu available for ${day}.</p>`;
      }
    } catch (error) {
      console.error(`Error fetching menu for ${day}:`, error);
      document
        .getElementById(dayIds[index])
        .querySelector(
          ".item_description"
        ).innerHTML = `<p>Error loading menu for ${day}.</p>`;
    }
  });
}

async function updateWeeklyMenuDisplay(burger, day, burgerId, dayId) {
  const menuEntry = document.getElementById(dayId);
  console.log(menuEntry, "menuEnetry");

  try {
    const response = await fetch(`${allergensUrl}${burgerId}`);
    if (!response.ok) throw new Error("Failed to fetch allergens");
    const allergens = await response.json();
    const allergenDisplay = allergens.map((a) => a.acronym).join(", ");
    //console.log("day:", day);

    // Update image source
    menuEntry.querySelector(".menu_item_image").src =
      baseUrl + `/api/v1/burgers/${burger.filename}`;
    menuEntry.querySelector(".menu_item_image").alt = burger.Name;

    // Update item description
    menuEntry.querySelector(".item_description").innerHTML = `
      <p>Menu for: ${day}</p>
      <h2>${burger.Name}</h2>
      <p>${burger.Description}</p>
      <p>${burger.Price} €</p>
      <p>Allergens: ${allergenDisplay}</p>
      <button class="add-to-cart-btn" data-id="${
        burger.ID
      }" data-burger='${JSON.stringify(burger)}'>
          <i class="fas fa-shopping-cart"></i> Add to Cart
      </button>
  </div>`;
    updateButtonVisibility();
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

      alert("Burger added to cart!");
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

// TODO: add error handling for when a burger is not found for the date

for (let button of weekdayButtons) {
  button.addEventListener("click", async (e) => {
    const selectedDate = e.target.innerText;
    const year = new Date().getFullYear();
    const specials = document.getElementsByClassName(
      "special-offers-section"
    )[0];
    if (specials) {
      specials.style.display = "none";
    }

    try {
      const menus = await fetchMenuByDate(selectedDate + year);
      if (menus.length > 0) {
        // Clear previous details if any
        //clearMenuDisplay();
        // Process each menu item
        menus.forEach(async (menu) => {
          const burgerDetails = await fetchBurgerByID(menu.burger_id);
          updateMenuDisplay(burgerDetails, selectedDate, menu.burger_id);
          clearMenuDisplay();
        });
      } else {
        console.log("No burgers found for this date");
      }
    } catch (error) {
      console.error("Error processing menus:", error);
    }

    // Manage active class on buttons
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
    const menus = await response.json();
    console.log("Fetched menus:", menus);
    return menus; // return the entire array
  } catch (error) {
    console.error("Error fetching menu by date:", error);
    return [];
  }
}

async function fetchMenuByDates(date) {
  //console.log("fetchMenuByDate date", date);
  const url = `${menusUrl}${date}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data: " + response.statusText);
    }
    const data = await response.json();
    //console.log("Full data response:", data);
    console.log(data);

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

async function fetchAndDisplayOffers() {
  const today = new Date().toISOString().slice(0, 10); // Format as 'YYYY-MM-DD'
  try {
    const response = await fetch(`${specialOffersUrl}?date=${today}`);
    if (!response.ok) throw new Error("Failed to fetch offers");
    let offers = await response.json();
    offers = offers.sort(
      (a, b) => new Date(a.start_date) - new Date(b.start_date)
    );

    offers.slice(0, 3).forEach(async (offer, index) => {
      const offerDiv = document.getElementById(`offer${index + 1}`);
      if (offerDiv) {
        const burgerDetailsResponse = await fetch(
          `${baseUrl}api/v1/hamburgers/${offer.burger_id}`
        );
        if (!burgerDetailsResponse.ok)
          throw new Error("Failed to fetch burger details");
        const burger = await burgerDetailsResponse.json();

        const allergensResponse = await fetch(
          `${allergensUrl}${offer.burger_id}`
        );
        if (!allergensResponse.ok) throw new Error("Failed to fetch allergens");
        const allergens = await allergensResponse.json();
        const allergenDisplay = allergens.map((a) => a.acronym).join(", ");

        offerDiv.querySelector(
          ".offer-image"
        ).src = `${baseUrl}/api/v1/burgers/${burger.filename}`;
        offerDiv.querySelector(".offer-title").textContent = burger.name;
        offerDiv.querySelector(".offer-description").textContent =
          burger.description;
        offerDiv.querySelector(".offer-price").textContent = `${offer.price} €`;
        offerDiv.querySelector(
          ".offer-dates"
        ).textContent = `Voimassa: ${formatDateForOffers(
          offer.start_date
        )} - ${formatDateForOffers(offer.end_date)}`;
      }
    });
  } catch (error) {
    console.error("Error loading special offers:", error);
  }
}

const formatDateForOffers = (date) => {
  const formattedDate = new Date(date);
  return `${formattedDate.getDate()}.${
    formattedDate.getMonth() + 1
  }.${formattedDate.getFullYear()}`;
};

async function fetchBurgerByID(burgerId) {
  const url = `${hamburgersUrl}/${burgerId}`;

  const response = await fetch(url);
  const burger = await response.json();
  return burger;
}

async function updateMenuDisplay(burger, date, burgerId) {
  const menuContainer = document.getElementsByClassName("menu_items")[0]; // This should be a container that will hold all menu entries

  try {
    const response = await fetch(`${allergensUrl}${burgerId}`);
    if (!response.ok) throw new Error("Failed to fetch allergens");
    const allergens = await response.json();
    const allergenDisplay = allergens.map((a) => a.acronym).join(", ");

    // Create a new div element for each burger
    const burgerDiv = document.createElement("div");
    burgerDiv.className = "menu_entry";
    burgerDiv.innerHTML = `
      
      <img src="${baseUrl}/api/v1/burgers/${burger.filename}" alt="${
      burger.Name
    }" class="menu_item_image">
      <div class="item_description">
          <p>Menu for: ${date}</p>
          <h2>${burger.Name}</h2>
          <p>${burger.Description}</p>
          <p>${burger.Price} €</p>
          <p>Allergens: ${allergenDisplay}</p>
          <button class="add-to-cart-btn" data-id="${
            burger.ID
          }" data-burger='${JSON.stringify(burger)}'>
              <i class="fas fa-shopping-cart"></i> Add to Cart
          </button>
      </div>`;

    menuContainer.appendChild(burgerDiv); // Append the new burger div to the container

    // Adding event listener to newly created button in burgerDiv
    burgerDiv
      .querySelector(".add-to-cart-btn")
      .addEventListener("click", function (e) {
        const burger = JSON.parse(e.target.dataset.burger);
        alert("Burger added to cart!");
        ShoppingCart.addItem({
          id: burger.ID,
          name: burger.Name,
          price: burger.Price,
          quantity: 1,
        });
      });
    updateButtonVisibility();
  } catch (error) {
    console.error("Error fetching allergens:", error);
    const errorDiv = document.createElement("div");
    errorDiv.innerHTML = `<p>Error loading menu details for ${burger.Name}.</p>`;
    menuContainer.appendChild(errorDiv);
  }
}

// Make sure this container is empty before populating it each time to avoid duplication
function clearMenuDisplay() {
  const menuContainer = document.getElementsByClassName("menu_items")[0];
  menuContainer.innerHTML = ""; // Clear previous contents
}

// Kirjautumisen näkymä
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

// Rekisteröinti näkymä
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

const loginSubmit = async () => {
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
  const response = await fetch(baseUrl + "api/v1/auth/", options);

  const json = await response.json();


  if (!json.user) {
    alert(json.error.message);
  } else {
    localStorage.setItem("token", json.token);
    localStorage.setItem("user", JSON.stringify(json.user));
    localStorage.setItem(
      "userName",
      json.user.firstname + " " + json.user.lastname
    );
    localStorage.setItem("userAddress", json.user.address);
    localStorage.setItem("userPhone", json.user.phone.toString());
    localStorage.setItem("userEmail", json.user.email);
    localStorage.setItem("userId", json.user.user_id);

    ShoppingCart.setUserId(json.user.username);

    loginForm.style.display = "none";
    user = JSON.parse(localStorage.getItem("user"));
    avatar.src = baseUrl + "api/v1/" + user.avatar;
    if (user.avatar === null) {
      avatar.src = baseUrl + "api/v1/default.jpg";
    }
    console.log(user.avatar);
    toggleLogin(true);
  }
}

// Kirjaudu sisään.

document.getElementById('loginForm').addEventListener('keydown', async (e) => { 
  if (e.key === 'Enter'){
    loginSubmit();
    e.preventDefault();
    console.log('enter');
  }
  console.log('not enter')
})


document.getElementById("login-apply").addEventListener("click", async (e) => {
  loginSubmit();
});

// Kirjaudu ulos

document.getElementById("logout-button").addEventListener("click", () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  ShoppingCart.setUserId(null);
  //ShoppingCart.logout();

  document.getElementById("cart-items").innerHTML = "";
  document.getElementById("cart-total").innerHTML = "Total: 0,00€";

  toggleLogin(false);
});

// Rekisteröinti fetch
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
    const response = await fetch(baseUrl + "api/v1/users/register", options);
    console.log(response);

    // Login if registrartion successful

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
      const response = await fetch(baseUrl + "api/v1/auth/", options);
      console.log(response);
      const json = await response.json();
      if (!json.user) {
        alert(json.error.message);
      } else {
        localStorage.setItem("token", json.token);
        localStorage.setItem("user", JSON.stringify(json.user));
        loginForm.style.display = "none";
        user = JSON.parse(localStorage.getItem("user"));
        document.getElementById("avatar").src =
          baseUrl + "api/v1/" + user.avatar;
        if (user.avatar === null) {
          avatar.src = baseUrl + "api/v1/default.jpg";
        }
        toggleLogin(true);
      }
    }
  });

const toggleLogin = (logged) => {
  console.log("toggleLogin called with:", logged);
  updateButtonVisibility();

  loginElement.style.display = logged ? "none" : "block";
  loggedElement.style.display = logged ? "block" : "none";
  avatar.src = baseUrl + "api/v1/" + user.avatar;
  if (user.avatar === null) {
    avatar.src = baseUrl + "api/v1/default.jpg";
  }
};

//  Siirtyy profiiliin

document.getElementById("profile-button").addEventListener("click", () => {
  window.location = "login.html";
});

// IIFE suoritetaan aina ku sivusto ladataan.

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
      const response = await fetch(baseUrl + "api/v1/auth/verify", options);
      console.log(response);
      if (response.ok) {
        toggleLogin(true);
      }
    } catch (e) {
      console.log(e);
    }
  }
})();
