import express from "express";
import multer from "multer";
import {
  getAllHamburgersController,
  addBurgerController,
  getBurgerByIdController,
  deleteBurgerController,
} from "../controllers/hamburger-controller.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/burgers/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1]
    );
  },
});

const upload = multer({ storage: storage });

const hamburgerRouter = express.Router();

/**
 * @api {delete} /hamburgers/:id Delete Burger
 * @apiName DeleteBurger
 * @apiGroup Hamburgers
 *
 * @apiParam {Number} id Unique identifier of the Burger to delete.
 *
 * @apiSuccess {Object} result Confirmation of deletion.
 * @apiSuccess {Boolean} result.success Indicates success of the operation.
 * @apiSuccess {String} result.message Description of the result.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "message": "Burger deleted successfully."
 *     }
 *
 * @apiError BurgerNotFound No Burger found with the given ID.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Failed to delete burger, no burger found with the given ID."
 *     }
 *
 * @apiError ServerError An error occurred on the server while trying to delete the burger.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to delete burger",
 *       "error": "Error description here"
 *     }
 */

hamburgerRouter.delete("/:id", deleteBurgerController);

/**
 * @api {get} /hamburgers/:id Get Burger by ID
 * @apiName GetBurgerById
 * @apiGroup Hamburgers
 *
 * @apiParam {Number} id Unique identifier of the Burger to retrieve.
 *
 * @apiSuccess {Object} burger Burger details.
 * @apiSuccess {Number} burger.ID Identifier of the Burger.
 * @apiSuccess {String} burger.Name Name of the Burger.
 * @apiSuccess {String} burger.Description Description of the Burger.
 * @apiSuccess {Number} burger.Price Price of the Burger.
 * @apiSuccess {String} burger.filename Filename of the burger image.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "ID": 1,
 *       "Name": "Classic Burger",
 *       "Description": "A classic burger with cheese and lettuce.",
 *       "Price": 5.99,
 *       "filename": "burger1.jpg"
 *     }
 *
 * @apiError BurgerNotFound No Burger found with the given ID.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Failed to retrieve burger, no burger found with the given ID."
 *     }
 *
 * @apiError ServerError Internal server error occurred while attempting to fetch the burger.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to retrieve burger",
 *       "error": "Error description here"
 *     }
 */

hamburgerRouter.get("/:id", getBurgerByIdController);

/**
 * @api {get} /hamburgers/ List All Hamburgers
 * @apiName GetAllHamburgers
 * @apiGroup Hamburgers
 *
 * @apiSuccess {Object[]} hamburgers Array of all hamburger objects.
 * @apiSuccess {Number} hamburgers.ID Identifier of the Hamburger.
 * @apiSuccess {String} hamburgers.Name Name of the Hamburger.
 * @apiSuccess {String} hamburgers.Description Description of the Hamburger.
 * @apiSuccess {Number} hamburgers.Price Price of the Hamburger.
 * @apiSuccess {String} hamburgers.filename Filename of the burger image.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "ID": 1,
 *         "Name": "Classic Burger",
 *         "Description": "A classic burger with cheese and lettuce.",
 *         "Price": 5.99,
 *         "filename": "burger1.jpg"
 *       },
 *       {
 *         "ID": 2,
 *         "Name": "Veggie Burger",
 *         "Description": "A delicious and healthy veggie burger with all green toppings.",
 *         "Price": 6.50,
 *         "filename": "burger2.jpg"
 *       }
 *     ]
 *
 * @apiError ServerError Failed to retrieve hamburgers.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to retrieve hamburgers",
 *       "error": "Error description here"
 *     }
 */

/**
 * @api {post} /hamburgers/ Add New Burger
 * @apiName AddNewBurger
 * @apiGroup Hamburgers
 *
 * @apiParam {String} add-burger-name Name of the Burger.
 * @apiParam {String} add-burger-description Description of the Burger.
 * @apiParam {Number} add-burger-price Price of the Burger.
 * @apiParam {String} ingredients Comma-separated list of ingredients.
 * @apiParam {Number[]} allergens Array of allergen IDs associated with the burger.
 * @apiParam {File} add-burger-upload-name Image file for the Burger (optional).
 *
 * @apiSuccess {Number} id Unique ID of the created Burger.
 * @apiSuccess {String} name Name of the created Burger.
 * @apiSuccess {String} description Description of the created Burger.
 * @apiSuccess {Number} price Price of the created Burger.
 * @apiSuccess {String} image Filename of the uploaded image, starting with 'add-burger-upload-name' followed by a unique suffix.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "id": 101,
 *       "name": "Spicy Burger",
 *       "description": "A burger with a kick of spice, topped with jalapenos and pepperjack cheese.",
 *       "price": 8.99,
 *       "image": "add-burger-upload-name-1627281849317.jpg"
 *     }
 *
 * @apiError BadRequest Error if the data provided is incomplete or malformed.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Missing required burger name or price"
 *     }
 *
 * @apiError ServerError Internal server error occurred while attempting to add the burger.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to add burger",
 *       "error": "Error description here"
 *     }
 */

hamburgerRouter
  .route("/")
  .get(getAllHamburgersController)
  .post(upload.single("add-burger-upload-name"), addBurgerController);

export default hamburgerRouter;
