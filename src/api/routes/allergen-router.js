import express from "express";
import {
  listAllAllergensController,
  listAllAllergensByBurgerIdController,
} from "../controllers/allergen-controller.js";

const allergenRouter = express.Router();

/**
 * @api {get} /allergens/ List All Allergens
 * @apiName ListAllAllergens
 * @apiGroup Allergens
 *
 * @apiSuccess {Object[]} allergens Array of all allergens.
 * @apiSuccess {Number} allergens.id The ID of the allergen.
 * @apiSuccess {String} allergens.name The name of the allergen.
 * @apiSuccess {String} allergens.acronym The acronym of the allergen.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "ID": 23,
 *         "name": "Laktoosi",
 *         "acronym": "L"
 *       },
 *       {
 *         "ID": 24,
 *         "name": "Gluteeni",
 *         "acronym": "G"
 *       }
 *     ]
 *
 * @apiError AllergensFetchError Unable to fetch allergens due to a server error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to retrieve allergens"
 *     }
 */
allergenRouter.get("/", listAllAllergensController);

/**
 * @api {get} /allergens/:id Get Allergens by Burger ID
 * @apiName GetAllergensByBurgerId
 * @apiGroup Allergens
 *
 * @apiParam {Number} id Burger's unique ID to retrieve allergens.
 *
 * @apiSuccess {Object[]} allergens List of allergens associated with the burger.
 * @apiSuccess {Number} allergens.ID The ID of the allergen.
 * @apiSuccess {String} allergens.acronym Acronym of the allergen.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "ID": 23,
 *         "acronym": "L"
 *       },
 *       {
 *         "ID": 24,
 *         "acronym": "G"
 *       }
 *     ]
 *
 * @apiError BurgerNotFound The ID of the Burger was not found or no allergens associated.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Failed to retrieve allergens"
 *     }
 */
allergenRouter.get("/:id", listAllAllergensByBurgerIdController);

export default allergenRouter;
