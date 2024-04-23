"use strict";

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

const users = [
  {
    id: "1",
    firstName: "Alice",
    lastName: "Johnson",
    address: "123 Elm St, Springfield",
    role: "admin",
    username: "alicej",
    password: "pass1234",
  },
  {
    id: "2",
    firstName: "Bob",
    lastName: "Smith",
    address: "456 Oak St, Riverside",
    role: "user",
    username: "bobsmith",
    password: "password123",
  },
  {
    id: "3",
    firstName: "Carol",
    lastName: "Williams",
    address: "789 Pine St, Greenfield",
    role: "user",
    username: "carolw",
    password: "mypassword",
  },
  {
    id: "4",
    firstName: "Dave",
    lastName: "Brown",
    address: "101 Maple Ave, Westfield",
    role: "admin",
    username: "daveb",
    password: "davespass",
  },
  {
    id: "5",
    firstName: "Eva",
    lastName: "Davis",
    address: "202 Birch Rd, Eastfield",
    role: "user",
    username: "evad",
    password: "evasecret",
  },
];
const hamburgers = [
  {
    id: 1,
    price: 8.99,
    description:
      "Classic Burger: A traditional beef burger with lettuce, tomato, and our special sauce.",
  },
  {
    id: 2,
    price: 9.99,
    description:
      "Cheese Lover’s Burger: Beef burger loaded with cheddar, mozzarella, and gouda, topped with pickles.",
  },
  {
    id: 3,
    price: 10.99,
    description:
      "Bacon Bliss Burger: Juicy beef burger with crisp bacon, blue cheese, and BBQ sauce.",
  },
  {
    id: 4,
    price: 11.99,
    description:
      "Spicy Fiesta Burger: Spicy beef patty with jalapeños, pepper jack cheese, and chipotle mayo.",
  },
  {
    id: 5,
    price: 7.99,
    description:
      "Simple Veggie Burger: A delightful blend of vegetables and beans, topped with fresh greens and tzatziki sauce.",
  },
];

const menus = [
  {
    hamburgerId: 1,
    date: "2024-04-20",
    name: "Classic Combo",
    price: 8.99,
    description: "A classic burger with cheese and special sauce.",
  },
  {
    hamburgerId: 2,
    date: "2024-04-21",
    name: "Cheese Lovers Delight",
    price: 9.99,
    description: "Loaded with three types of cheese.",
  },
  {
    hamburgerId: 3,
    date: "2024-04-22",
    name: "Bacon Bonanza",
    price: 10.99,
    description: "Crispy bacon and smoky barbecue sauce.",
  },
  {
    hamburgerId: 4,
    date: "2024-04-23",
    name: "Spicy Special",
    price: 11.99,
    description: "Spicy jalapeños and hot chipotle mayo.",
  },
  {
    hamburgerId: 5,
    date: "2024-04-24",
    name: "Veggie Favorite",
    price: 7.99,
    description: "A fresh veggie patty with green fixins.",
  },
];

const ingredients = [
  { id: 1, name: "Beef Patty" },
  { id: 2, name: "Lettuce" },
  { id: 3, name: "Tomato" },
  { id: 4, name: "Cheddar Cheese" },
  { id: 5, name: "Pickles" },
  { id: 6, name: "Bacon" },
  { id: 7, name: "Blue Cheese" },
  { id: 8, name: "BBQ Sauce" },
  { id: 9, name: "Jalapeños" },
  { id: 10, name: "Chipotle Mayo" },
];

const hamburgerIngredients = [
  { hamburgerId: 1, ingredientId: 1 },
  { hamburgerId: 1, ingredientId: 2 },
  { hamburgerId: 1, ingredientId: 3 },
  { hamburgerId: 2, ingredientId: 1 },
  { hamburgerId: 2, ingredientId: 4 },
  { hamburgerId: 2, ingredientId: 5 },
  { hamburgerId: 3, ingredientId: 1 },
  { hamburgerId: 3, ingredientId: 6 },
  { hamburgerId: 3, ingredientId: 7 },
  { hamburgerId: 3, ingredientId: 8 },
  { hamburgerId: 4, ingredientId: 1 },
  { hamburgerId: 4, ingredientId: 9 },
  { hamburgerId: 4, ingredientId: 10 },
  { hamburgerId: 5, ingredientId: 2 },
  { hamburgerId: 5, ingredientId: 3 },
];

const allergens = [
  { id: 1, mark: "G" },
  { id: 2, mark: "L" },
  { id: 3, mark: "M" },
];

const hamburgerAllergens = [
  { hamburgerId: 1, allergenId: 3 }, // Beef Patty may contain dairy
  { hamburgerId: 2, allergenId: 3 }, // Cheddar Cheese contains dairy
  { hamburgerId: 3, allergenId: 3 }, // Blue Cheese contains dairy
  { hamburgerId: 4, allergenId: 1 }, // Some sauces might contain gluten
  { hamburgerId: 4, allergenId: 3 }, // Adding dairy to the spicy fiesta burger for cheese
  { hamburgerId: 5, allergenId: 1 }, // Some veggie burgers might contain gluten
  { hamburgerId: 5, allergenId: 2 }, // Assuming veggie burgers may contain nuts
];

const orders = [
  { orderId: 1 },
  { orderId: 2 },
  { orderId: 3 },
  { orderId: 4 },
  { orderId: 5 },
];

const orderHistory = [
  { userId: "user_1", orderId: 1, date: "2024-04-20", status: "ordered" },
  { userId: "user_2", orderId: 2, date: "2024-04-21", status: "delivered" },
  { userId: "user_3", orderId: 3, date: "2024-04-22", status: "delivered" },
  { userId: "user_4", orderId: 4, date: "2024-04-23", status: "ordered" },
  { userId: "user_5", orderId: 5, date: "2024-04-24", status: "cancelled" },
];

const jointOrder = [
  { hamburgerId: 1, orderId: 1 },
  { hamburgerId: 3, orderId: 1 },
  { hamburgerId: 2, orderId: 2 },
  { hamburgerId: 4, orderId: 3 },
  { hamburgerId: 5, orderId: 4 },
  { hamburgerId: 2, orderId: 4 },
  { hamburgerId: 1, orderId: 5 },
  { hamburgerId: 3, orderId: 5 },
];

const populateUserSelector = () => {
  const userSelector = document.getElementById("user");
  users.forEach((user) => {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = `${user.firstName} ${user.lastName}`;
    userSelector.appendChild(option);
  });
};

const populateMenuSelector = () => {
  const menuSelector = document.getElementById("menu");

  menus.forEach((menu) => {
    const option = document.createElement("option");
    option.value = menu.hamburgerId;
    option.textContent = `${menu.name}`;
    menuSelector.appendChild(option);
  });
};

const populateMockData = () => {
  populateUserSelector();
  populateMenuSelector();
};

populateMockData();

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

// Attach event listeners to each link
Object.keys(linksToContentMap).forEach((linkId) => {
  const link = document.getElementById(linkId);
  if (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default anchor behavior
      updateOptionsInput(linksToContentMap[linkId]);
    });
  }
});

// DEV only: Simulate a user login
// Role-based display logic
const roleSelector = document.getElementById("roleSelector");
const adminSection = document.getElementById("adminSection");

roleSelector.addEventListener("change", () => {
  adminSection.style.display =
    roleSelector.value === "admin" ? "block" : "none";
});

// Initial display check based on selector's default value
adminSection.style.display = roleSelector.value === "admin" ? "block" : "none";
