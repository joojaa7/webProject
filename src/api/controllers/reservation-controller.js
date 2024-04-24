import {
  getAllReservations as getAllReservationsModel,
  addReservation as addReservationModel,
  updateReservation as updateReservationModel,
  deleteReservation as deleteReservationModel,
  fetchReservationsForTableAndDate,
  fetchCustomerByReservationId,
} from '../models/reservation-model.js';

// Controller to fetch all reservations
const getAllReservations = async (req, res) => {
  try {
    const reservations = await getAllReservationsModel();
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res
      .status(500)
      .json({message: 'Failed to retrieve reservations', error: error.message});
  }
};

// Controller to add a new reservation
const addReservation = async (req, res) => {
  const {
    table_id,
    customer_id,
    number_of_guests,
    start_time,
    end_time,
    status,
  } = req.body;
  console.log('Adding reservation in controller:', req.body);
  try {
    const newReservation = await addReservationModel(
      table_id,
      customer_id,
      number_of_guests,
      start_time,
      end_time,
      status
    );
    res.status(201).json(newReservation);
  } catch (error) {
    console.error('Error adding reservation:', error);
    res
      .status(500)
      .json({message: 'Failed to add reservation', error: error.message});
  }
};

// Controller to update an existing reservation
const updateReservation = async (req, res) => {
  const reservationId = req.params.id;
  const updates = req.body; // Object containing fields to update
  try {
    const result = await updateReservationModel(reservationId, updates);
    if (result > 0) {
      res.json({message: 'Reservation updated successfully'});
    } else {
      res.status(404).json({message: 'Reservation not found'});
    }
  } catch (error) {
    console.error('Error updating reservation:', error);
    res
      .status(500)
      .json({message: 'Failed to update reservation', error: error.message});
  }
};

// Controller to delete a reservation
const deleteReservation = async (req, res) => {
  const reservationId = req.params.id;
  try {
    const result = await deleteReservationModel(reservationId);
    if (result > 0) {
      res.json({message: 'Reservation deleted successfully'});
    } else {
      res.status(404).json({message: 'Reservation not found'});
    }
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res
      .status(500)
      .json({message: 'Failed to delete reservation', error: error.message});
  }
};

// reservation-controller.js
const getReservationsByTableAndDate = async (req, res) => {
  const {tableId} = req.params;
  const {date} = req.query;

  try {
    const reservations = await fetchReservationsForTableAndDate(tableId, date);
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res
      .status(500)
      .json({message: 'Failed to retrieve reservations', error: error.message});
  }
};

const getCustomerByReservationId = async (req, res) => {
  const reservationId = req.params.reservationId;
  try {
    const customer = await fetchCustomerByReservationId(reservationId);
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).send('Customer not found for this reservation');
    }
  } catch (error) {
    console.error('Failed to fetch customer by reservation ID:', error);
    res.status(500).send('Error fetching customer details');
  }
};

export {
  getAllReservations,
  addReservation,
  updateReservation,
  deleteReservation,
  getReservationsByTableAndDate,
  getCustomerByReservationId,
};
