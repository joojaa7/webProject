import express from "express";
import { listAllIngredientsController } from "../controllers/ingredient-controller.js";

const ingredientRouter = express.Router();

/**
 * @api {get} /ingredients List All Ingredients
 * @apiName ListAllIngredients
 * @apiGroup Ingredients
 *
 * @apiSuccess {Object[]} ingredients Array of all ingredients.
 * @apiSuccess {Number} ingredients.ID The unique identifier of the ingredient.
 * @apiSuccess {String} ingredients.Name The name of the ingredient.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "ID": 1,
 *         "Name": "Tomato"
 *       },
 *       {
 *         "ID": 2,
 *         "Name": "Lettuce"
 *       }
 *     ]
 *
 * @apiError ServerError Failed to retrieve ingredients.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to retrieve ingredients",
 *       "error": "Error description here"
 *     }
 */

ingredientRouter.get("/", listAllIngredientsController);

export default ingredientRouter;
