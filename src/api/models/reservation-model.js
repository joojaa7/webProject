import promisePool from '../../utils/database.js';

const getAllReservations = async () => {
  const [rows] = await promisePool.query('SELECT * FROM reservations');
  return rows;
};

// Add a new reservation
const addReservation = async (
  tableId,
  customerId,
  numberOfGuests,
  startTime,
  endTime,
  status
) => {
  const [result] = await promisePool.execute(
    'INSERT INTO reservations (table_id, customer_id, number_of_guests, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, ?)',
    [tableId, customerId, numberOfGuests, startTime, endTime, status]
  );
  return {reservation_id: result.insertId};
};

// Update a reservation
const updateReservation = async (reservationId, updates) => {
  // updates is an object with keys matching the reservation fields that can be updated
  const [result] = await promisePool.execute(
    'UPDATE reservations SET ? WHERE reservation_id = ?',
    [updates, reservationId]
  );
  return result.affectedRows;
};

// Delete a reservation
const deleteReservation = async (reservationId) => {
  const [result] = await promisePool.execute(
    'DELETE FROM reservations WHERE reservation_id = ?',
    [reservationId]
  );
  return result.affectedRows;
};

const fetchReservationsForTableAndDate = async (tableId, date) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM reservations WHERE table_id = ? AND DATE(start_time) = ?',
      [tableId, date]
    );
    return rows;
  } catch (err) {
    console.error('Error fetching reservations:', err);
    throw err; // Re-throw to handle it in the controller
  }
};

const fetchCustomerByReservationId = async (reservationId) => {
  const query = `
    SELECT c.customer_id, c.name, c.contact_info
    FROM customers c
    JOIN reservations r ON c.customer_id = r.customer_id
    WHERE r.reservation_id = ?;
  `;
  try {
    const [customer] = await promisePool.execute(query, [reservationId]);
    return customer.length ? customer[0] : null;
  } catch (err) {
    console.error('Error fetching customer by reservation ID:', err);
    throw err; // Re-throw to handle it in the controller
  }
};

export {
  getAllReservations,
  addReservation,
  updateReservation,
  deleteReservation,
  fetchReservationsForTableAndDate,
  fetchCustomerByReservationId,
};
