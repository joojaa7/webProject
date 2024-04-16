console.log("In use.");

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
