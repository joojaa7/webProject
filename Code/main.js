console.log("In use.");
console.log(document.getElementById('register-submit-btn'));

const fileInput = document.getElementById('file')

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

const weekdayButtons = document.getElementsByClassName("weekday_link");

for (let button of weekdayButtons) {
  button.addEventListener("click", (e) => {
    console.log(e);
    console.log(e.target.innerText);
    document.getElementsByClassName("menu_items")[0].innerHTML = `
            <p>Menu for: ${e.target.innerText}</p>
            <div class="menu_entry">
                <img src="hampurilaiset.jpg" alt="hampurilaiset" class="menu_item_image">
                <div class="item_description">
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos perspiciatis consequatur ab aspernatur explicabo dolore minima, 
                        ipsam nostrum nihil fugit, voluptates distinctio aperiam numquam rerum tempore maiores rem soluta ducimus?</p>
                </div>
            </div>`;
    // Elementit luodaat dynaamisesti datasta.s
  });
}
/*
document.getElementById('login').addEventListener('click', () => {
    window.location = 'login.html';
})
*/

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


document.getElementById('register-submit-btn').addEventListener('click', async (e) => {
  e.preventDefault();
  console.log('Registering user');
  let avatar = null;
  const formData = new FormData();
  const firstName = document.getElementById('firstname').value;
  const lastName = document.getElementById('lastname').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const cardNumber = document.getElementById('cardnumber').value;
  const phoneNumber = document.getElementById('phone-number').value;
  const address = document.getElementById('address').value;
  const email = document.getElementById('email').value;
  // const inputs = [firstName, lastName, username, password, cardNumber, phoneNumber, address, email];
  // inputs.forEach(input => {
  //   if (!input) {
  //     alert('Please fill in all fields');
  //     return;
  //   }
  // });
    
  if (fileInput.files[0]) {
    avatar = fileInput.files[0].name;
    formData.append('file', fileInput.files[0])
  }
  formData.append('firstname', firstName);
  formData.append('lastname', lastName);
  formData.append('username', username);
  formData.append('password', password)
  formData.append('cardnumber', cardNumber);
  formData.append('phonenumber', phoneNumber);
  formData.append('address', address);
  formData.append('email', email);
  formData.append('avatar', avatar)
  console.log(formData)
  const options = {
    method: 'POST',
    body: formData,
  };
  console.log(options)
  const response = await fetch('http://127.0.0.1:3000/users/register', options);
  registerForm.style.display = "none";
  console.log(response)
})