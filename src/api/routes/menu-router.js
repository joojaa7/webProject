import express from "express";
import {
  addMenuItemController,
  getMenuByDateController,
} from "../controllers/menu-controller.js";

const menuRouter = express.Router();

//menuRouter.route("/").post(addMenuItemController);
menuRouter.get("/:date", getMenuByDateController);

export default menuRouter;
