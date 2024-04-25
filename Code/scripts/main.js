console.log("In use.");

const fileInput = document.getElementById("file");

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

// Kommentoi index2 kokeiluun tästä eteenpäin ->

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
  // Format the date as "DD.MM."
  return `${date.getDate()}.${date.getMonth() + 1}.`;
}

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

// <-- tähän asti


// Kommenteista pois tästä ->


// const wkd = document.getElementsByClassName('weekdays')[0];
// const wkd_divs = [];



// const containerDiv = document.getElementsByClassName("menu_items")[0];
// data.sort((a, b) => new Date(a.Pvm) - new Date(b.Pvm));
// console.log(data);
// let previousPvm = null;
// let div = null;
// let weekday = null;

// data.forEach(item => {
//   if (item.Pvm !== previousPvm) {
//     weekday = document.createElement('li');
//     weekday.textContent = item.Pvm;
//     div = document.createElement('div');
//     div.setAttribute('id', item.Pvm);
//     containerDiv.appendChild(div);
//     wkd.appendChild(weekday);
//     wkd_divs.push(div);
//   }
  
//   const divElement = document.createElement('div');
//   divElement.innerHTML = `
//     <div class="menu_entry">
//         <img src="../hampurilaiset.jpg" alt="hampurilaiset" class="menu_item_image">
//         <div class="item_description">
//             <p>${item.Kuvaus}</p>
//         </div>
//     </div>`;
  
//   div.appendChild(divElement);
  
//   previousPvm = item.Pvm;
// });

// console.log(wkd_divs);
// wkd_divs.forEach((div) => {
//   div.style.display = 'none';
//   if (div.id === date) {
//     div.style.display = 'block';
//   };
// });

// <-- tähän asti

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
  const name = document.getElementById('loginUsername').value;
  const pw = document.getElementById('loginPassword').value;
  console.log(name, pw);
  const loginUser = {
    username: name,
    password: pw
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginUser),
  };
  const response = await fetch('http://127.0.0.1:3000/api/v1/auth/', options);
  console.log(response);
  const json = await response.json();
  if (!json.user) {
    alert(json.error.message);
  } else {
    sessionStorage.setItem('token', json.token);
    sessionStorage.setItem('user', JSON.stringify(json.user));
    loginForm.style.display = "none";
    window.location = 'login.html';
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


  document.getElementById('avatar-submit').addEventListener('click', async (e) => {
    console.log(e)
    let avatar = null;
    const formData = new FormData();
    if (avatarFile.files[0]) {
      avatar = avatarFile.files[0].name;
      formData.append('file', avatarFile.files[0])
    } else {
      alert('SELECT FILE')
      return
    }
    const userData = JSON.parse(sessionStorage.getItem('user'))
    formData.append('avatar', avatar);
    formData.append('username', userData.username);
    const options = {
      method: 'PUT',
      body: formData,
    };
    if (userData.username) {
      const response = await fetch('http://127.0.0.1:3000/api/v1/users/avatar', options);
      const json = await response.json();
      inputForm.reset();
      if (response.ok){
        console.log('OK')
        userData.avatar = json.avatar
        sessionStorage.setItem('user', JSON.stringify(userData));
        user = JSON.parse(sessionStorage.getItem('user'));
      } else {
        alert(response);
    }} else {
      alert('Log in required.')
    }
  })