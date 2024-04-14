const linksToContentMap = {
  "avatar-link": "avatar-content",
  "bio-link": "bio-content",
  "contact_info-link": "contact_info-content",
  "preferences-link": "preferences-content",
  "order_history-link": "order_history-content",
  "bonus-link": "bonus-content",
};
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
