import express from "express";

import {
  getAllTables,
  getTableWithId,
  getTableLocationWithId,
  addNewTable,
  removeTableById,
  modifyExistingTable,
  getTablesByLocation,
  fetchTablesWithStatus,
} from "../controllers/table-controller.js";

const tableRouter = express.Router();

/**
 * @api {get} /tables/ List All Tables
 * @apiName GetAllTables
 * @apiGroup Tables
 *
 * @apiSuccess {Object[]} tables Array of all table objects.
 * @apiSuccess {Number} tables.table_id Unique identifier of the table.
 * @apiSuccess {Number} tables.capacity Capacity of the table.
 * @apiSuccess {String} tables.location Location of the table.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "table_id": 1,
 *         "capacity": 4,
 *         "location": "Patio"
 *       },
 *       {
 *         "table_id": 2,
 *         "capacity": 2,
 *         "location": "Main Hall"
 *       }
 *     ]
 *
 * @apiError ServerError Internal server error occurred while attempting to retrieve the tables.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to fetch tables",
 *       "error": "Detailed error description here"
 *     }
 */
/**
 * @api {post} /tables/ Add New Table
 * @apiName AddNewTable
 * @apiGroup Tables
 *
 * @apiParam {Number} capacity The capacity of the new table.
 * @apiParam {String} location The location of the new table.
 *
 * @apiSuccess {Object} newTable Details of the newly added table.
 * @apiSuccess {Number} newTable.id Unique identifier of the newly created table.
 * @apiSuccess {Number} newTable.capacity Capacity of the new table.
 * @apiSuccess {String} newTable.location Location of the new table.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "id": 101,
 *       "capacity": 4,
 *       "location": "By the window"
 *     }
 *
 * @apiError BadRequest The required fields were not provided or were invalid.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Invalid capacity or location"
 *     }
 *
 * @apiError ServerError Internal server error occurred while attempting to add the new table.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to add new table",
 *       "error": "Detailed error description here"
 *     }
 */

tableRouter.route("/").get(getAllTables).post(addNewTable);

/**
 * @api {get} /tables/with-status Get Tables with Latest Status
 * @apiName FetchTablesWithStatus
 * @apiGroup Tables
 *
 * @apiSuccess {Object[]} tables Array of table objects with their latest status.
 * @apiSuccess {Number} tables.table_id Unique identifier of the table.
 * @apiSuccess {Number} tables.capacity Capacity of the table.
 * @apiSuccess {String} tables.location Location of the table.
 * @apiSuccess {String} tables.status Latest status of the table based on the most recent reservation.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "table_id": 1,
 *         "capacity": 4,
 *         "location": "Patio",
 *         "status": "Reserved"
 *       },
 *       {
 *         "table_id": 2,
 *         "capacity": 2,
 *         "location": "Main Hall",
 *         "status": "Available"
 *       }
 *     ]
 *
 * @apiError ServerError Internal server error occurred while attempting to retrieve the tables with their statuses.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to retrieve tables with statuses",
 *       "error": "Detailed error description here"
 *     }
 */

tableRouter.route("/with-status").get(fetchTablesWithStatus);

/**
 * @api {get} /tables/location/:location Get Tables by Location
 * @apiName GetTablesByLocation
 * @apiGroup Tables
 *
 * @apiParam {String} location The location to filter tables by.
 *
 * @apiSuccess {Object[]} tables Array of table objects filtered by location.
 * @apiSuccess {Number} tables.table_id Unique identifier of the table.
 * @apiSuccess {Number} tables.capacity Capacity of the table.
 * @apiSuccess {String} tables.location Location of the table.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "table_id": 3,
 *         "capacity": 6,
 *         "location": "Terrace"
 *       },
 *       {
 *         "table_id": 4,
 *         "capacity": 4,
 *         "location": "Terrace"
 *       }
 *     ]
 *
 * @apiError NotFound No tables found for the specified location.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "No tables found for the specified location"
 *     }
 *
 * @apiError ServerError Internal server error occurred while attempting to retrieve tables by location.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Error retrieving tables",
 *       "error": "Detailed error description here"
 *     }
 */

tableRouter.route("/location/:location").get(getTablesByLocation);

/**
 * @api {get} /tables/:id/location Get Table Location by ID
 * @apiName GetTableLocationWithId
 * @apiGroup Tables
 *
 * @apiParam {Number} id The unique identifier of the table.
 *
 * @apiSuccess {Object} location Object containing the ID and location of the table.
 * @apiSuccess {Number} location.table_id ID of the table.
 * @apiSuccess {String} location.location Location of the table.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "table_id": 1,
 *       "location": "Patio"
 *     }
 *
 * @apiError NotFound No location found for the specified table ID.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Table location not found"
 *     }
 *
 * @apiError ServerError Internal server error occurred while attempting to retrieve the table location.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to fetch table location by ID",
 *       "error": "Detailed error description here"
 *     }
 */

tableRouter.route("/:id/location").get(getTableLocationWithId);

/**
 * @api {get} /tables/:id Get Table by ID
 * @apiName GetTableById
 * @apiGroup Tables
 *
 * @apiParam {Number} id The unique identifier of the table to retrieve.
 *
 * @apiSuccess {Object} table Detailed information about the table.
 * @apiSuccess {Number} table.table_id Unique identifier of the table.
 * @apiSuccess {Number} table.capacity Capacity of the table.
 * @apiSuccess {String} table.location Location of the table.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "table_id": 1,
 *       "capacity": 4,
 *       "location": "Patio"
 *     }
 *
 * @apiError NotFound The table with the given ID was not found.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Table not found"
 *     }
 *
 * @apiError ServerError Internal server error occurred while attempting to retrieve the table.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to fetch table by ID",
 *       "error": "Detailed error description here"
 *     }
 */

/**
 * @api {delete} /tables/:id Delete Table by ID
 * @apiName DeleteTableById
 * @apiGroup Tables
 *
 * @apiParam {Number} id The unique identifier of the table to be deleted.
 *
 * @apiSuccess {String} message Confirmation message stating the table was successfully deleted.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Table successfully deleted"
 *     }
 *
 * @apiError NotFound The table with the given ID was not found or has already been deleted.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Table not found or already deleted"
 *     }
 *
 * @apiError ServerError Internal server error occurred while attempting to delete the table.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to remove table",
 *       "error": "Detailed error description here"
 *     }
 */

/**
 * @api {put} /tables/:id Modify Table by ID
 * @apiName ModifyTableById
 * @apiGroup Tables
 * @apiDescription Modify an existing table with the specified ID.
 * @apiParam {Number} id The unique identifier of the table to be modified.
 * @apiParam {Number} capacity The updated capacity of the table.
 * @apiParam {String} location The updated location of the table.
 *
 * @apiSuccess {String} message Confirmation message stating the table was successfully updated.
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *   {
 *    "message": "Table successfully updated"
 *  }
 *
 * @apiError NotFound The table with the given ID was not found or no changes were made.
 * @apiErrorExample {json} Error-Response:
 *   HTTP/1.1 404 Not Found
 *  {
 *   "message": "Table not found or no changes made"
 * }
 *
 * @apiError ServerError Internal server error occurred while attempting to modify the table.
 * @apiErrorExample {json} Error-Response:
 *  HTTP/1.1 500 Internal Server Error
 * {
 *  "message": "Failed to modify table",
 * "error": "Detailed error description here"
 * }
 */

tableRouter
  .route("/:id")
  .get(getTableWithId)
  .delete(removeTableById)
  .put(modifyExistingTable);

export default tableRouter;
