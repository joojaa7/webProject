import express from "express";
import {
  listAllAllergensController,
  listAllAllergensByBurgerIdController,
} from "../controllers/allergen-controller.js";

const allergenRouter = express.Router();
allergenRouter.get("/", listAllAllergensController);
allergenRouter.get("/:id", listAllAllergensByBurgerIdController);

export default allergenRouter;
