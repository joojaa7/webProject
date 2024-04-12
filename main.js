console.log('In use.')

const weekdayButtons = document.getElementsByClassName('weekday_link');

for (let button of weekdayButtons) {
    button.addEventListener('click', (e) => {
        console.log(e);
        console.log(e.target.innerText);
        document.getElementsByClassName('menu_items')[0].innerHTML = `
        <p>Menu for: ${e.target.innerText}</p>
        <div class="menu_entry">
            <img src="hampurilaiset.jpg" alt="hampurilaiset" class="menu_item_image">
            <div class="item_description">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos perspiciatis consequatur ab aspernatur explicabo dolore minima, 
                    ipsam nostrum nihil fugit, voluptates distinctio aperiam numquam rerum tempore maiores rem soluta ducimus?</p>
            </div>
        </div>`
        // Elementit luodaat dynaamisesti datasta.s
    })
}

document.getElementById('login').addEventListener('click', () => {
    window.location = 'login.html';
})