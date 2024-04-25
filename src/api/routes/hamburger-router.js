import express from "express";
import {
  getAllHamburgersController,
  addBurgerController,
} from "../controllers/hamburger-controller.js";

const hamburgerRouter = express.Router();

hamburgerRouter
  .route("/")
  .get(getAllHamburgersController)
  .post(addBurgerController);

export default hamburgerRouter;
