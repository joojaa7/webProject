import express from "express";
import { listAllIngredientsController } from "../controllers/ingredient-controller.js";

const ingredientRouter = express.Router();

ingredientRouter.get("/", listAllIngredientsController);

export default ingredientRouter;
