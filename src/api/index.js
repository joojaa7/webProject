import express from "express";
import userRouter from "./routes/user-router.js";
import tableRouter from "./routes/table-router.js";
import customerRouter from "./routes/customer-router.js";
import reservationRouter from "./routes/reservation-router.js";

//Placeholder code
const router = express.Router();

// bind base url for all cat routes to catRouter
router.use("/users", userRouter);
router.use("/tables", tableRouter);
router.use("/customers", customerRouter);
router.use("/reservations", reservationRouter);

export default router;
