import express from "express";
import {
  getAllHamburgersController,
  addBurgerController,
  getBurgerByIdController,
} from "../controllers/hamburger-controller.js";

const hamburgerRouter = express.Router();

hamburgerRouter.get("/:id", getBurgerByIdController);
hamburgerRouter
  .route("/")
  .get(getAllHamburgersController)
  .post(addBurgerController);

export default hamburgerRouter;
