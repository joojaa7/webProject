import express from "express";
import { addMenuItemController } from "../controllers/menu-controller.js";

const menuRouter = express.Router();

menuRouter.route("/").post(addMenuItemController);

export default menuRouter;
