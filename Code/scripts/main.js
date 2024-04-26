console.log("In use.");
import { menusUrl, hamburgersUrl } from "./variables.js";

const fileInput = document.getElementById("file");

const date = "01.01.2024";

const data = [
  {
    Nimi: "Juustohamppari",
    Pvm: "01.01.2024",
  },
  {
    Nimi: "Epäjuustohamppari",
    Pvm: "02.01.2024",
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

/*
const weekdayButtons = document.getElementsByClassName("weekday_link");

for (let button of weekdayButtons) {
  button.addEventListener("click", (e) => {
    console.log(e);
    console.log(e.target.innerText);
    for (let button of weekdayButtons) {
      button.classList.remove("active");
    }

    e.target.classList.add("active");
    document.getElementsByClassName("menu_items")[0].innerHTML = `
            <p>Menu for: ${e.target.innerText}</p>
            <div class="menu_entry">
                <img src="../hampurilaiset.jpg" alt="hampurilaiset" class="menu_item_image">
                <div class="item_description">
                    <p>testing</p>
                </div>
            </div>`;
  });
}

document.getElementById('login').addEventListener('click', () => {
    window.location = 'login.html';
})
*/

const weekdayButtons = document.getElementsByClassName("weekday_link");

for (let button of weekdayButtons) {
  button.addEventListener("click", async (e) => {
    const selectedDate = e.target.innerText;
    console.log("selectedDate", selectedDate);
    try {
      const burgerId = await fetchMenuByDate(selectedDate + "2024");
      console.log("burgerId in frontend", burgerId);
      if (burgerId) {
        const burgerDetails = await fetchBurgerByID(burgerId);
        updateMenuDisplay(burgerDetails, selectedDate);
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
  console.log("fetchMenuByDate date", date);
  const url = `${menusUrl}${date}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch data: " + response.statusText);
    }
    const data = await response.json();
    console.log("Full data response:", data);

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

function updateMenuDisplay(burger, date) {
  console.log("burger in updatemnu", burger);
  const menuItems = document.getElementsByClassName("menu_items")[0];
  menuItems.innerHTML = `
    <p>Menu for: ${date}</p>
    <div class="menu_entry">
        <img src="../path_to_burger_image/${burger[0].filename}" alt="${burger[0].Name}" class="menu_item_image">
        <div class="item_description">
            <p>${burger[0].Description}</p>
        </div>
    </div>`;
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

// DEV only
// event listener for submit button, directs to login page
// to be replaced later with actual login functionality
document
  .getElementById("login-submit-btn")
  .addEventListener("click", function (e) {
    e.preventDefault();
    window.location = "login.html";
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
    // const inputs = [firstName, lastName, username, password, cardNumber, phoneNumber, address, email];
    // inputs.forEach(input => {
    //   if (!input) {
    //     alert('Please fill in all fields');
    //     return;
    //   }
    // });

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
      "http://127.0.0.1:3000/users/register",
      options
    );
    registerForm.style.display = "none";
    console.log(response);
  });
