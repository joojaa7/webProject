"use strict";
import {
  hamburgersUrl,
  menusUrl,
  specialOffersUrl,
  allergensUrl,
} from "./variables.js";

const orderHistory = document.getElementById("history-table");
const activeOrders = document.getElementById("active-table");
let user = JSON.parse(localStorage.getItem("user"));
const avatar = document.getElementById("user-avatar");
avatar.src = user.avatar ? "../" + user.avatar : "../default.jpg";
console.log(user);

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("add-burger-form");
  const menu = document.getElementById("update-menu-form");

  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    await addBurger(form);
    form.reset();
  });

  try {
    const allergens = await fetchAllergens();
    populateAllergensSelect(allergens);
  } catch (error) {
    console.error("Failed to load allergens:", error);
    alert("Failed to load allergens");
  }

  menu.addEventListener("submit", async function (event) {
    event.preventDefault();
    await addMenu();
    menu.reset();
  });

  initializeEventListeners();
});

document
  .getElementById("delete-burger-btn")
  .addEventListener("click", async () => {
    const select = document.getElementById("delete-burger");
    const burgerId = select.value;

    if (!burgerId) {
      alert("Select a burger to delete");
      return;
    }
    try {
      const response = await fetch(`${hamburgersUrl}/${burgerId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete burger");
      }
      alert("Burger deleted successfully");
      select.removeChild(select.querySelector(`option[value="${burgerId}"]`));
    } catch (error) {
      console.error("Error deleting burger:", error);
      alert("Failed to delete burger");
    }
  });

async function fetchAllergens() {
  const response = await fetch(allergensUrl);
  if (!response.ok) {
    throw new Error("Failed to fetch allergens");
  }
  const allergens = await response.json();
  return allergens;
}

function populateAllergensSelect(allergens) {
  const select = document.getElementById("allergens-select");
  allergens.forEach((allergen) => {
    const option = document.createElement("option");
    option.value = allergen.ID; // Assuming your allergen objects have an ID property
    option.textContent = allergen.name; // Assuming your allergen objects have a name property
    select.appendChild(option);
  });
}

const linksToContentMap = {
  "avatar-link": "avatar-content",
  "bio-link": "bio-content",
  "contact_info-link": "contact_info-content",
  "preferences-link": "preferences-content",
  "order_history-link": "order_history-content",
  "bonus-link": "bonus-content",
  "admin_update_menu-link": "admin-update-menu-content",
  "admin_update_users-link": "admin-update-users-content",
  "admin-order": "active-order-content",
  "reservations-link": "reservations-content",
  "admin_special_offers-link": "admin-special-offers-content",
  "delete-account-link": "delete-account-content",
};

const fetchBurgersForMenu = async () => {
  try {
    const response = await fetch(hamburgersUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const burgers = await response.json();
    populateBurgers(burgers, "menu-burger");
  } catch (error) {
    console.error("Error fetching burgers:", error);
  }
};

const fetchBurgersForDelete = async () => {
  try {
    const response = await fetch(hamburgersUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const burgers = await response.json();
    populateBurgers(burgers, "delete-burger");
  } catch (error) {
    console.error("Error fetching burgers:", error);
  }
};

const fetchBurgersForSpecialOffers = async () => {
  try {
    const response = await fetch(hamburgersUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const burgers = await response.json();
    populateBurgers(burgers, "special-offer-burger");
  } catch (error) {
    console.error("Error fetching burgers:", error);
  }
};

function populateBurgers(burgers, selectId) {
  const select = document.getElementById(selectId);
  //select.innerHTML = "";
  burgers.forEach((burger) => {
    const option = document.createElement("option");
    option.value = burger.ID;
    option.textContent = burger.Name;
    select.appendChild(option);
  });
}

function updatePreview() {
  const offerNameInput = document.getElementById("special-offer-name-id");
  const offerDescriptionInput = document.getElementById(
    "special-offer-description-id"
  );
  const offerPriceInput = document.getElementById("special-offer-price-id");
  const startDateInput = document.getElementById("special-offer-start-date");
  const endDateInput = document.getElementById("special-offer-end-date");
  const burgerInput = document.getElementById("special-offer-burger");

  document.getElementById("preview-name").textContent = offerNameInput.value;
  document.getElementById("preview-description").textContent =
    offerDescriptionInput.value;
  document.getElementById(
    "preview-price"
  ).textContent = `${offerPriceInput.value}€`;
  document.getElementById("preview-burger").textContent =
    burgerInput.options[burgerInput.selectedIndex].text;

  const formattedStartDate = convertDateFormat(startDateInput.value);
  const formattedEndDate = convertDateFormat(endDateInput.value);
  document.getElementById(
    "preview-date"
  ).textContent = `Tarjous voimassa: ${formattedStartDate} - ${formattedEndDate}`;
}

function handleFileSelect(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    document.getElementById("preview-image").src = e.target.result;
  };
  reader.readAsDataURL(event.target.files[0]);
}

function initializeEventListeners() {
  const inputs = [
    document.getElementById("special-offer-name-id"),
    document.getElementById("special-offer-description-id"),
    document.getElementById("special-offer-price-id"),
    document.getElementById("special-offer-upload-id"),
    document.getElementById("special-offer-start-date"),
    document.getElementById("special-offer-end-date"),
    document.getElementById("special-offer-burger"),
  ];

  inputs.forEach((input) => {
    const eventType = input.type === "file" ? "change" : "input";
    input.addEventListener(eventType, updatePreview);
  });

  document
    .getElementById("special-offer-upload-id")
    .addEventListener("change", handleFileSelect);

  const offerForm = document.getElementById("update-special_offer-form");
  offerForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = collectFormData(offerForm);
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    if (formData) {
      try {
        await submitOfferData(formData);
        alert("Offer added successfully!");
      } catch (error) {
        console.error("Error submitting form data:", error);
        alert("Failed to add offer: " + error.message);
      }
    } else {
      alert("Form data is missing, check your inputs.");
    }
  });
}

function collectFormData(form) {
  const formData = new FormData(form);

  return formData;
}

async function submitOfferData(formData) {
  const response = await fetch(specialOffersUrl, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to submit form data: ${errorText}`);
  }
  return await response.json();
}

// const optionsInput = document.querySelector(".options-input");
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
  //console.log("burger", burger); // logs burger id (number)

  const date = document.getElementById("menu-date").value; // Date format: YYYY-MM-DD
  //console.log("date", date); // logs YYYY-MM-DD

  const formattedDate = convertDateFormat(date);
  //console.log("formattedDate", formattedDate); // logs DD.MM.YYYY

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
    //console.log("Success:", result);
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
        fetchBurgersForMenu();
        fetchBurgersForDelete();
      } else if (linkId === "admin_special_offers-link") {
        fetchBurgersForSpecialOffers();
      }

      event.preventDefault(); // Prevent default anchor behavior
      updateOptionsInput(linksToContentMap[linkId]);
    });
  }
});

const adminSection = document.getElementById("adminSection");

adminSection.style.display = user.role === "Admin" ? "block" : "none";

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
        "http://127.0.0.1:3000/api/v1/users/avatar/update",
        options
      );
      const json = await response.json();
      inputForm.reset();
      if (response.ok) {
        console.log(json);
        console.log("OK");
        userData.avatar = json.avatar;
        localStorage.setItem("user", JSON.stringify(userData));
        document.getElementById("user-avatar").src = "../" + json.avatar;
      } else {
        alert("Log in required.");
      }
    }
  });

document
  .getElementById("submit-userinfo-update")
  .addEventListener("click", async (e) => {
    e.preventDefault();
    const updatedPhone = document.getElementById("phone-number").value;
    const updatedEmail = document.getElementById("email").value;
    const updatedAddress = document.getElementById("address").value;
    const updatedCard = document.getElementById("Cardnumber").value;
    const userName = JSON.parse(localStorage.getItem("user")).username;

    const updateUser = {
      phone_number: updatedPhone ? updatedPhone : undefined,
      email: updatedEmail ? updatedEmail : undefined,
      Address: updatedAddress ? updatedAddress : undefined,
      Cardnumber: updatedCard ? updatedCard : undefined,
    };

    Object.keys(updateUser).forEach(
      (key) => updateUser[key] === undefined && delete updateUser[key]
    ); // Poistaa tyhjät ominaisuudet

    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateUser),
    };

    const response = await fetch(
      `http://127.0.0.1:3000/api/v1/users/${userName}`,
      options
    );
    console.log(response);
  });

document.getElementById("frontpage-button").addEventListener("click", () => {
  window.location = "index.html";
});

const populateOrderHistory = async (username) => {
  const response = await fetch(
    `http://127.0.0.1:3000/api/v1/users/orders/${username}`
  );
  const json = await response.json();
  json.sort((a, b) => a.order_id - b.order_id);
  json.forEach((order) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${order.name}</td><td>${order.quantity}</td><td>${order.Date}</td><td>${order.Status}</td>`;
    orderHistory.append(tr);
    // Tilauksen kokonaishinta mukaan?
  });
};

const activeOrderHandling = {
  orders: [],
};

const populateActiveOrders = async () => {
  const response = await fetch(
    `http://127.0.0.1:3000/api/v1/users/admin/orders/active`
  );
  const json = await response.json();
  //console.log(json);
  json.forEach((order) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${order.order_id}</td><td>${order.name}</td><td>${order.quantity}</td>
                    <td>${order.Firstname}</td><td>${order.Lastname}</td>
                    <td>${order.Address}</td><td>${order.phone_number}</td>
                    <td>${order.Date}</td><td>${order.Status}</td>`;
    tr.setAttribute("class", "active");
    tr.addEventListener("click", () => {
      const clickedOrderId = order.order_id;
      console.log("click");
      if (!activeOrderHandling.orders.includes(clickedOrderId)) {
        activeOrderHandling.orders.push(order.order_id);
      }

      // Löytyykö siistimpää tapaa muuttaa taustan väriä?

      document.querySelectorAll("tr.active").forEach((tr) => {
        const tdContent = tr
          .querySelector("td:nth-child(1)")
          .textContent.trim();
        if (Number(tdContent) === clickedOrderId) {
          if (tr.style.backgroundColor === "rgb(110, 233, 192)") {
            tr.style.backgroundColor = "#fdf8f1";
            const index = activeOrderHandling.orders.indexOf(Number(tdContent));
            if (index > -1) {
              activeOrderHandling.orders.splice(index, 1);
            }
            return;
          }
          tr.style.backgroundColor = "rgb(110, 233, 192)";
        }
      });
    });
    activeOrders.append(tr);
    // Tilauksen kokonaishinta mukaan?
  });
};

const updateOrderStatus = async () => {
  const updatedStatus = document.getElementById("order-select").value;
  const orders = activeOrderHandling.orders;
  const data = {
    status: updatedStatus,
    orders: orders,
  };
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const response = await fetch(
    `http://127.0.0.1:3000/api/v1/users/admin/orders/active`,
    options
  );
  console.log(response);
  if (response.ok) {
    alert("Success.");
    console.log("OK");
  }
};

document.getElementById("update-order").addEventListener("click", async () => {
  await updateOrderStatus();
  while (activeOrders.rows.length > 1) {
    activeOrders.deleteRow(1);
  }
  populateActiveOrders();
});

document
  .getElementById("delete-account")
  .addEventListener("click", async () => {
    if (user.username === "root") {
      alert("ÄLÄ POISTA ROOTTIA");
      return;
    }
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch(
      `http://127.0.0.1:3000/api/v1/users/${user.username}`,
      options
    );
    console.log(response);
    if (response.ok) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("shoppingCart");
      window.location = "index.html";
    }
  });

populateOrderHistory(user.username);
populateActiveOrders();
