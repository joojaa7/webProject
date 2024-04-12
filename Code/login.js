// Get the modal
var modal = document.getElementById('myModal');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
var links = document.querySelectorAll('.options-items a');
links.forEach(function (link) {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        var contentId = link.id.replace('-link', '-content');
        var contentText = document.getElementById(contentId).innerHTML;
        document.getElementById('modal-body').innerHTML = contentText;
        modal.style.display = "block";
    });
});

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
