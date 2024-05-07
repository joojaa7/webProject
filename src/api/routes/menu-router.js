import express from "express";
import {
  addMenuItemController,
  getMenuByDateController,
} from "../controllers/menu-controller.js";

const menuRouter = express.Router();

/**
 * @api {post} /menus/ Add Menu Item
 * @apiName AddMenuItem
 * @apiGroup Menu
 *
 * @apiParam {Number} burger_id The unique identifier of the burger to be added to the menu.
 * @apiParam {String} date The date when the burger is to be featured on the menu.
 *
 * @apiSuccess {Object} menu Details of the newly added menu item.
 * @apiSuccess {Number} menu.burger_id ID of the burger added to the menu.
 * @apiSuccess {String} menu.date The date on which the burger will be featured on the menu.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "burger_id": 101,
 *       "date": "2024-05-04"
 *     }
 *
 * @apiError BadRequest The required fields were not provided.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Missing burger_id or date"
 *     }
 *
 * @apiError ServerError Internal server error occurred while attempting to add the menu item.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to add menu item",
 *       "error": "Detailed error description here"
 *     }
 */

menuRouter.route("/").post(addMenuItemController);

/**
 * @api {get} /menus/:date Get Menu by Date
 * @apiName GetMenuByDate
 * @apiGroup Menu
 *
 * @apiParam {String} date Date for which the menu is to be retrieved, in the format YYYY-MM-DD.
 *
 * @apiSuccess {Object[]} menu Array of menu items for the specified date.
 * @apiSuccess {Number} menu.burger_id ID of the burger featured on the menu.
 * @apiSuccess {String} menu.date Date when the burger is featured.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "burger_id": 101,
 *         "date": "2024-05-04"
 *       },
 *       {
 *         "burger_id": 102,
 *         "date": "2024-05-04"
 *       }
 *     ]
 *
 * @apiError NotFound No menu found for the given date.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "No menu found for the date"
 *     }
 *
 * @apiError ServerError Internal server error occurred while attempting to retrieve the menu.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to retrieve menu",
 *       "error": "Detailed error description here"
 *     }
 */

menuRouter.get("/:date", getMenuByDateController);

export default menuRouter;
