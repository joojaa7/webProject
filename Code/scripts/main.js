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
const baseUrl = 'http://127.0.0.1:3001/';
//const baseUrl = "https://10.120.32.51/web/";

document.addEventListener("DOMContentLoaded", async () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser) {
    ShoppingCart.setUserId(storedUser.username);
  } else {
    ShoppingCart.setUserId(null);
  }
  setWeekDates();
  ShoppingCart.loadCart();
  ShoppingCart.updateCartDisplay();
  fetchAndDisplayOffers();
  updateButtonVisibility();
  const today = new Date();
  console.log(formatDate(today), "formatted");
  const year = new Date().getFullYear();
  getDaysMenu(formatDate(today), year);
});

const getDaysMenu = async (today, year) => {
  console.log(today, year);
  try {
    const menus = await fetchMenuByDate(today + year);
    if (menus.length > 0) {
      menus.forEach(async (menu) => {
        const burgerDetails = await fetchBurgerByID(menu.burger_id);
        updateMenuDisplay(burgerDetails, today, menu.burger_id);
        clearMenuDisplay();
      });
    } else {
      console.log("No burgers found for this date");
    }
  } catch (error) {
    console.error("Error processing menus:", error);
  }
};

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
    items,
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
  const cart = document.getElementById("shopping-cart");
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
  modalCartItems.innerHTML = ""; 

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
  const dayOfWeek = today.getDay(); 

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
  const day = ("0" + date.getDate()).slice(-2);
  const month = ("0" + (date.getMonth() + 1)).slice(-2); 
  return `${day}.${month}.`; // Returns 'DD.MM.'
}

const weekdayButtons = document.getElementsByClassName("weekday_link");


for (let button of weekdayButtons) {
  button.addEventListener("click", async (e) => {
    const selectedDate = e.target.innerText;
    console.log(e.target.innerText);
    const year = new Date().getFullYear();
    const specials = document.getElementsByClassName(
      "special-offers-section"
    )[0];

    getDaysMenu(selectedDate, year);

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

        offerDiv.querySelector(
          ".offer-image"
        ).src = `${baseUrl}/api/v1/burgers/${burger.filename}`;
        offerDiv.querySelector(".offer-title").textContent = offer.offer_name;
        offerDiv.querySelector(".offer-description").textContent =
          offer.description;
        offerDiv.querySelector(".offer-price").textContent = `${offer.price} €`;
        offerDiv.querySelector(
          ".offer-dates"
        ).textContent = `Valid: ${formatDateForOffers(
          offer.start_date
        )} to ${formatDateForOffers(offer.end_date)}`;
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
  const menuContainer = document.getElementsByClassName("menu_items")[0];

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
    }
      "class="menu_item_image">
      <div class="item_description">
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

    menuContainer.appendChild(burgerDiv);

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
    const errorDiv = document.createElement("div");
    errorDiv.innerHTML = `<p>Error loading menu details for ${burger.Name}.</p>`;
    menuContainer.appendChild(errorDiv);
  }
}

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
    alert('Something went wrong.');
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
    toggleLogin(true);
  }
};

// Kirjaudu sisään.

document.getElementById("loginForm").addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    loginSubmit();
    e.preventDefault();
  }
});

document.getElementById("login-apply").addEventListener("click", async (e) => {
  loginSubmit();
});

// Kirjaudu ulos

document.getElementById("logout-button").addEventListener("click", () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.clear();

  document.getElementById("cart-items").innerHTML = "";
  document.getElementById("cart-total").innerHTML = "Total: 0,00€";
  toggleLogin(false);
});

// Register
document
  .getElementById("register-submit-btn")
  .addEventListener("click", async (e) => {
    e.preventDefault();
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
    const response = await fetch(baseUrl + "api/v1/users/register", options);

    // Login if registrartion successful

    if (response.ok) {
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
      const json = await response.json();
      if (!json.user) {
        alert('Something went wrong.');
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


(async () => {
  if (localStorage.getItem("token") && localStorage.getItem("user")) {
    try {
      const options = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(baseUrl + "api/v1/auth/verify", options);
      if (response.ok) {
        toggleLogin(true);
      }
    } catch (e) {
    }
  }
})();
