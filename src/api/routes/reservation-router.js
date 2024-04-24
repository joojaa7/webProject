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

reservationRouter.get("/:tableId", getReservationsByTableAndDate);
reservationRouter.get("/", getAllReservations);
reservationRouter.post("/", addReservation);
reservationRouter.put("/:id", updateReservation);
reservationRouter.delete("/:id", deleteReservation);
reservationRouter.get("/customer/:reservationId", getCustomerByReservationId);

export default reservationRouter;
