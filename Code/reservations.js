"use strict";

import { tablesUrl } from "./variables.js";
import { reservationsUrl } from "./variables.js";

let currentTableId = 10;

document
  .getElementById("loadReservationsForDate")
  .addEventListener("click", async function () {
    const date = document.getElementById("reservationDate").value;
    if (!date) {
      alert("Please select a date.");
      return;
    }
    displayTableReservations(currentTableId, date);
    document.getElementById(
      "currentTable"
    ).textContent = `Details for table: ${currentTableId}`;
  });

// Helper function to format JavaScript Date object to MySQL datetime format
function formatToMySQLDateTime(date) {
  return date.toISOString().replace("T", " ").substring(0, 19);
}

// Helper function to clear the form fields
function clearForm() {
  const form = document.querySelector("#reservationModifications form");
  if (form) {
    form.reset(); // Resets all form fields to their initial values
  }
}

// Helper function to format reservation time
const formatReservationTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

function generateTimeSlots() {
  const slots = [];
  for (let hour = 8; hour < 21; hour++) {
    const time = `${hour.toString().padStart(2, "0")}:00`; // two-digit format
    slots.push(time);
  }
  return slots;
}

function setupTableClickHandlers() {
  const tables = document.querySelectorAll(".table");
  tables.forEach((table) => {
    table.addEventListener("click", function () {
      const tableId = this.textContent.match(/Table ID: (\d+),/)[1];
      document.getElementById(
        "currentTable"
      ).textContent = `Details for table: ${tableId}`;
      const date = document.getElementById("reservationDate").value;
      displayTableReservations(tableId, date);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("previousDayBtn")
    .addEventListener("click", () => changeDate(-1));

  document
    .getElementById("nextDayBtn")
    .addEventListener("click", () => changeDate(1));

  // Initialize with today's date and load initial table reservations
  const initialDate = new Date();
  updateDateInput(initialDate);
  loadTablesAndReservations(initialDate);
});

function changeDate(dayChange) {
  const currentDate = new Date(
    document.getElementById("reservationDate").value
  );
  currentDate.setDate(currentDate.getDate() + dayChange);
  document.getElementById("reservationDate").value = currentDate
    .toISOString()
    .split("T")[0];

  // Load new table data for the updated date
  loadTablesAndReservations(currentDate);
}

function updateDateInput(date) {
  const dateStr = date.toISOString().split("T")[0];
  document.getElementById("reservationDate").value = dateStr; // Updates the date input
}

function loadTablesAndReservations(date) {
  const url = `${tablesUrl}?date=${date.toISOString().split("T")[0]}`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch tables: " + response.statusText);
      }
      return response.json();
    })
    .then((tables) => {
      const tablesGrid = document.getElementById("tablesGrid");
      tablesGrid.innerHTML = "";
      tables.forEach((table) => {
        const tableDiv = document.createElement("div");
        tableDiv.className = "table";
        tableDiv.textContent = `Table ID: ${table.table_id}, Seats: ${table.capacity}, Location: ${table.location}`;
        tableDiv.onclick = () => {
          document.getElementById(
            "currentTable"
          ).textContent = `Details for table: ${table.table_id}`;
          currentTableId = table.table_id;
          displayTableReservations(currentTableId, date);
        };
        tablesGrid.appendChild(tableDiv);
      });
      setupTableClickHandlers();

      if (currentTableId) {
        displayTableReservations(currentTableId, date);
      }
    })
    .catch((error) => {
      console.error("Error loading tables:", error);
      tablesGrid.textContent = "Error loading tables.";
    });
}

function createAddReservationForm(timeSlot) {
  const modificationsDiv = document.getElementById("reservationModifications");
  modificationsDiv.innerHTML = "";

  // Create a form dynamically
  const form = document.createElement("form");
  form.onsubmit = (e) => {
    e.preventDefault();
    const date = document.getElementById("reservationDate").value;
    const customerId = customerIdInput.value;
    const numberOfGuests = numberOfGuestsInput.value;
    addReservation(timeSlot, customerId, numberOfGuests, date);
  };

  // Input for customer ID
  const customerIdInput = document.createElement("input");
  customerIdInput.type = "number";
  customerIdInput.placeholder = "Customer ID";
  customerIdInput.required = true;

  // Input for number of guests
  const numberOfGuestsInput = document.createElement("input");
  numberOfGuestsInput.type = "number";
  numberOfGuestsInput.placeholder = "Number of Guests";
  numberOfGuestsInput.required = true;

  // Add reservation button
  const addButton = document.createElement("button");
  addButton.type = "submit";
  addButton.textContent = "Add Reservation";

  // Close button
  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.textContent = "Close";
  closeButton.onclick = () => {
    modificationsDiv.style.display = "none";
  };

  // Append inputs and button to form
  form.appendChild(customerIdInput);
  form.appendChild(numberOfGuestsInput);
  form.appendChild(addButton);
  form.appendChild(closeButton);

  // Append the form to the modificationsDiv
  modificationsDiv.appendChild(form);
  modificationsDiv.style.display = "block";
}

async function modifyReservationForm(reservationId) {
  try {
    const userDetails = await fetchCustomerByReservationId(reservationId);
    if (userDetails) {
      displayModifyReservationForm(userDetails, reservationId);
    } else {
      throw new Error(
        "No customer details found for the given reservation ID."
      );
    }
  } catch (error) {
    console.error("Error modifying reservation:", error);
    alert("Error modifying reservation: " + error.message);
  }
}

async function fetchCustomerByReservationId(reservationId) {
  const response = await fetch(`${reservationsUrl}customer/${reservationId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch customer details");
  }
  return await response.json(); // Assuming the API returns customer details directly
}

// TODO: Implement the updateReservation function to send a PUT request to the API to modify a reservation
// TODO: Modify add reservation form to ask for customer data, save customer details as reservation is being made
// TODO: Create "add new customer" and "use existing customer" buttons in the add reservation form
// TODO: Implement calendar between previous and next day buttons to select the date
// TODO: Implement a way to delete reservations
// TODO: Implement a way to change the status of a reservation (e.g., from "Confirmed" to "Cancelled")
// TODO: Display amount of customers and reservations and other data for a selected date
// TODO: Implement a way to filter reservations by status (e.g., show only "Confirmed" reservations)
// TODO: Implement visual to table reservations (e.g., color the table divs based on the number of reservations or customers)
// TODO: Implement a way to search for reservations by customer name or ID
// TODO: Implement a user friendly guided method to add a new reservation

function displayModifyReservationForm(userDetails, reservationId) {
  const modificationsDiv = document.getElementById("reservationModifications");
  modificationsDiv.innerHTML = ""; // Clear any existing content
  console.log(userDetails);

  const form = document.createElement("form");
  form.onsubmit = (e) => {
    e.preventDefault();
    updateReservation(reservationId, nameInput.value, contactInfoInput.value);
  };

  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.value = userDetails.name;
  nameInput.placeholder = "Customer Name";

  const contactInfoInput = document.createElement("input");
  contactInfoInput.type = "text";
  contactInfoInput.value = userDetails.contact_info;
  contactInfoInput.placeholder = "Contact Info";

  const numberOfGuestsInput = document.createElement("input");
  numberOfGuestsInput.type = "number";
  numberOfGuestsInput.value = userDetails.number_of_guests;
  numberOfGuestsInput.placeholder = "Number of Guests";

  const closeButton = document.createElement("button");
  closeButton.type = "button";
  closeButton.textContent = "Close";
  closeButton.onclick = () => {
    modificationsDiv.style.display = "none";
  };

  const saveButton = document.createElement("button");
  saveButton.type = "submit";
  saveButton.textContent = "Save Changes";

  form.appendChild(nameInput);
  form.appendChild(contactInfoInput);
  form.appendChild(numberOfGuestsInput);
  form.appendChild(saveButton);
  form.appendChild(closeButton);

  modificationsDiv.appendChild(form);
  modificationsDiv.style.display = "block";
}

function addReservation(timeSlot, customerId, numberOfGuests, date) {
  const startTime = new Date(`${date}T${timeSlot}:00Z`); // Construct the start time for the reservation
  const endTime = new Date(startTime.getTime() + 60 * 60000); // End time, assuming 1 hour duration

  // Format dates to MySQL acceptable format
  const startTimeFormatted = formatToMySQLDateTime(startTime);
  const endTimeFormatted = formatToMySQLDateTime(endTime);

  fetch(reservationsUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      table_id: currentTableId,
      customer_id: customerId,
      number_of_guests: numberOfGuests,
      start_time: startTimeFormatted,
      end_time: endTimeFormatted,
      status: "Confirmed", // Default status
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to add reservation");
      }
      return response.json();
    })
    .then((data) => {
      alert("Reservation added successfully!");
      displayTableReservations(currentTableId, new Date(date)); // Refresh the reservation details
      clearForm();
    })
    .catch((error) => {
      console.error("Error adding reservation:", error);
      alert("Error adding reservation: " + error.message);
    });
}

function displayTableReservations(tableId, dateString) {
  // Convert dateString to a Date object first
  const date = new Date(dateString);
  const dateStr = date.toISOString().split("T")[0];
  const reservationDetails = document.getElementById("reservationDetails");
  const url = `${reservationsUrl}/${tableId}?date=${dateStr}`;
  const timeSlots = generateTimeSlots();

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch reservations: " + response.statusText);
      }
      return response.json();
    })
    .then((reservations) => {
      reservationDetails.innerHTML = ""; // Clear previous reservation details
      timeSlots.forEach((slot) => {
        const slotDiv = document.createElement("div");
        const res = reservations.find((r) => {
          const reservationHour = new Date(r.start_time).getHours();
          const slotHour = parseInt(slot.split(":")[0]);
          return reservationHour === slotHour;
        });
        if (res) {
          console.log(res.start_time);
          slotDiv.textContent = `${formatReservationTime(
            res.start_time
          )} to ${formatReservationTime(res.end_time)} - Status: ${
            res.status
          }, Guests: ${res.number_of_guests}, Customer ID: ${res.customer_id}`;
          slotDiv.className = "reserved";
          slotDiv.onclick = () => modifyReservationForm(res.reservation_id);
        } else {
          slotDiv.textContent = `${slot} - FREE`;
          slotDiv.className = "free";
          slotDiv.onclick = () => createAddReservationForm(slot);
        }
        reservationDetails.appendChild(slotDiv);
      });
    })
    .catch((error) => {
      console.error("Error loading reservations:", error);
      reservationDetails.textContent = "Error loading reservations.";
    });
}
