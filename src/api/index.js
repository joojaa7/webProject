import express from "express";
import userRouter from "./routes/user-router.js";
import tableRouter from "./routes/table-router.js";
import customerRouter from "./routes/customer-router.js";
import reservationRouter from "./routes/reservation-router.js";
import hamburgerRouter from "./routes/hamburger-router.js";
import menuRouter from "./routes/menu-router.js";
import authRouter from "./routes/auth-router.js";
import ingredientRouter from "./routes/ingredient-router.js";
import allergenRouter from "./routes/allergen-router.js";
import specialOfferRouter from "./routes/special-offer-router.js";

//Placeholder code
const router = express.Router();

router.use("/users", userRouter);
router.use("/tables", tableRouter);
router.use("/customers", customerRouter);
router.use("/reservations", reservationRouter);
router.use("/hamburgers", hamburgerRouter);
router.use("/menus", menuRouter);
router.use("/auth", authRouter);
router.use("/ingredients", ingredientRouter);
router.use("/allergens", allergenRouter);
router.use("/special_offers", specialOfferRouter);

export default router;
