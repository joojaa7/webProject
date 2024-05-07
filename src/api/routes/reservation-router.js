import express from "express";
import {
  getAllReservations,
  addReservation,
  updateReservation,
  deleteReservation,
  getReservationsByTableAndDate,
  getCustomerByReservationId,
} from "../controllers/reservation-controller.js";

const reservationRouter = express.Router();

/**
 * @api {get} /reservations/:tableId Get Reservations by Table and Date
 * @apiName GetReservationsByTableAndDate
 * @apiGroup Reservations
 *
 * @apiParam {Number} tableId Unique identifier of the table.
 * @apiParam {String} date Date for which to retrieve reservations (query parameter), format YYYY-MM-DD.
 *
 * @apiSuccess {Object[]} reservations List of reservations for the specified table on the given date.
 * @apiSuccess {Number} reservations.reservation_id Unique identifier of the reservation.
 * @apiSuccess {Number} reservations.table_id ID of the table reserved.
 * @apiSuccess {Number} reservations.customer_id ID of the customer who made the reservation.
 * @apiSuccess {Number} reservations.number_of_guests Number of guests for the reservation.
 * @apiSuccess {String} reservations.start_time Start time of the reservation.
 * @apiSuccess {String} reservations.end_time End time of the reservation.
 * @apiSuccess {String} reservations.status Current status of the reservation (e.g., "confirmed", "completed", "cancelled").
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "reservation_id": 123,
 *         "table_id": 1,
 *         "customer_id": 45,
 *         "number_of_guests": 4,
 *         "start_time": "2024-05-04T19:00:00",
 *         "end_time": "2024-05-04T21:00:00",
 *         "status": "confirmed"
 *       }
 *     ]
 *
 * @apiError NotFound No reservations found for the specified table and date.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "No reservations found for the specified table and date."
 *     }
 *
 * @apiError ServerError Internal server error occurred while attempting to retrieve the reservations.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to retrieve reservations",
 *       "error": "Error description here"
 *     }
 */

reservationRouter.get("/:tableId", getReservationsByTableAndDate);

/**
 * @api {get} /reservations/ List All Reservations
 * @apiName GetAllReservations
 * @apiGroup Reservations
 *
 * @apiSuccess {Object[]} reservations Array of all reservations.
 * @apiSuccess {Number} reservations.reservation_id Unique identifier of the reservation.
 * @apiSuccess {Number} reservations.table_id ID of the table reserved.
 * @apiSuccess {Number} reservations.customer_id ID of the customer who made the reservation.
 * @apiSuccess {Number} reservations.number_of_guests Number of guests for the reservation.
 * @apiSuccess {String} reservations.start_time Start time of the reservation.
 * @apiSuccess {String} reservations.end_time End time of the reservation.
 * @apiSuccess {String} reservations.status Current status of the reservation (e.g., "confirmed", "completed", "cancelled").
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "reservation_id": 123,
 *         "table_id": 1,
 *         "customer_id": 45,
 *         "number_of_guests": 4,
 *         "start_time": "2024-05-04T19:00:00",
 *         "end_time": "2024-05-04T21:00:00",
 *         "status": "confirmed"
 *       },
 *       {
 *         "reservation_id": 124,
 *         "table_id": 2,
 *         "customer_id": 46,
 *         "number_of_guests": 2,
 *         "start_time": "2024-05-05T12:00:00",
 *         "end_time": "2024-05-05T14:00:00",
 *         "status": "cancelled"
 *       }
 *     ]
 *
 * @apiError ServerError Internal server error occurred while attempting to retrieve all reservations.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to retrieve reservations",
 *       "error": "Error description here"
 *     }
 */

reservationRouter.get("/", getAllReservations);

/**
 * @api {post} /reservations/ Add Reservation
 * @apiName AddReservation
 * @apiGroup Reservations
 *
 * @apiParam {Number} table_id The ID of the table for the reservation.
 * @apiParam {Number} customer_id The ID of the customer making the reservation.
 * @apiParam {Number} number_of_guests The number of guests included in the reservation.
 * @apiParam {String} start_time The start time of the reservation, formatted as 'YYYY-MM-DD HH:MM:SS'.
 * @apiParam {String} end_time The end time of the reservation, formatted as 'YYYY-MM-DD HH:MM:SS'.
 * @apiParam {String} status The status of the reservation (e.g., "confirmed", "cancelled").
 *
 * @apiSuccess {Number} reservation_id The unique identifier of the newly created reservation.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "reservation_id": 101
 *     }
 *
 * @apiError BadRequest The required fields were not provided or were invalid.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Missing required reservation details or invalid date format"
 *     }
 *
 * @apiError ServerError Internal server error occurred while attempting to add the reservation.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to add reservation",
 *       "error": "Detailed error description here"
 *     }
 */

reservationRouter.post("/", addReservation);

/**
 * @api {put} /reservations/:id Update Reservation
 * @apiName UpdateReservation
 * @apiGroup Reservations
 *
 * @apiParam {Number} id Unique identifier of the reservation to update.
 *
 * @apiBody {Number} [table_id] Optionally update the table ID for the reservation.
 * @apiBody {Number} [customer_id] Optionally update the customer ID for the reservation.
 * @apiBody {Number} [number_of_guests] Optionally update the number of guests.
 * @apiBody {String} [start_time] Optionally update the start time of the reservation (format: YYYY-MM-DD HH:MM:SS).
 * @apiBody {String} [end_time] Optionally update the end time of the reservation (format: YYYY-MM-DD HH:MM:SS).
 * @apiBody {String} [status] Optionally update the status of the reservation (e.g., "confirmed", "cancelled").
 *
 * @apiSuccess {String} message Confirmation message stating the reservation was updated successfully.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Reservation updated successfully"
 *     }
 *
 * @apiError NotFound The reservation with the given ID was not found.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Reservation not found"
 *     }
 *
 * @apiError BadRequest The update parameters were invalid.
 * @apiErrorExample {json} BadRequest-Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Invalid update parameters"
 *     }
 *
 * @apiError ServerError Internal server error occurred while attempting to update the reservation.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to update reservation",
 *       "error": "Detailed error description here"
 *     }
 */

reservationRouter.put("/:id", updateReservation);

/**
 * @api {delete} /reservations/:id Delete Reservation
 * @apiName DeleteReservation
 * @apiGroup Reservations
 *
 * @apiParam {Number} id Unique identifier of the reservation to delete.
 *
 * @apiSuccess {String} message Confirmation message stating the reservation was deleted successfully.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Reservation deleted successfully"
 *     }
 *
 * @apiError NotFound The reservation with the given ID was not found.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Reservation not found"
 *     }
 *
 * @apiError ServerError Internal server error occurred while attempting to delete the reservation.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to delete reservation",
 *       "error": "Detailed error description here"
 *     }
 */

reservationRouter.delete("/:id", deleteReservation);

/**
 * @api {get} /reservations/customer/:reservationId Get Customer by Reservation ID
 * @apiName GetCustomerByReservationId
 * @apiGroup Reservations
 *
 * @apiParam {Number} reservationId Unique identifier of the reservation.
 *
 * @apiSuccess {Object} customer Details of the customer associated with the reservation.
 * @apiSuccess {Number} customer.customer_id ID of the customer.
 * @apiSuccess {String} customer.name Name of the customer.
 * @apiSuccess {String} customer.contact_info Contact information of the customer.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "customer_id": 45,
 *       "name": "John Doe",
 *       "contact_info": "john.doe@example.com"
 *     }
 *
 * @apiError NotFound No customer found for the given reservation ID.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Customer not found for this reservation"
 *     }
 *
 * @apiError ServerError Internal server error occurred while attempting to fetch the customer.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Error fetching customer details"
 *     }
 */

reservationRouter.get("/customer/:reservationId", getCustomerByReservationId);

export default reservationRouter;
