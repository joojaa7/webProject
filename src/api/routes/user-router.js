import express from "express";
import {
  getOrdersByName,
  getOrdersByStatus,
  getUser,
  postOrderController,
  postUser,
  updateAvatar,
  updateOrder,
  updateUser,
  addOrderItemsController,
  deleteUser,
} from "../controllers/user-controller.js";
import multer from "multer";

const userRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    const originalFilename = file.originalname.split(".")[0].toLowerCase();
    const prefix = `${originalFilename}-${file.fieldname}`;

    let extension = "jpg";

    if (file.mimetype === "image/png") {
      extension = "png";
    }

    const filename = `${prefix}-${suffix}.${extension}`;

    cb(null, filename);
  },
});

const upload = multer({
  dest: "uploads/",
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      const error = new Error("Only images are supported.");
      error.status = 400;
      cb(error);
    }
  },
});

/**
 * @api {get} /users/:name Get User by Username
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {String} name The username of the user to retrieve.
 *
 * @apiSuccess {Object} user Details of the user.
 * @apiSuccess {Number} user.ID Unique identifier of the user.
 * @apiSuccess {String} user.Firstname First name of the user.
 * @apiSuccess {String} user.Lastname Last name of the user.
 * @apiSuccess {String} user.Address Address of the user.
 * @apiSuccess {String} user.Role Role of the user.
 * @apiSuccess {String} user.Username Username of the user.
 * @apiSuccess {String} user.Password Password of the user.
 * @apiSuccess {Number} user.Cardnumber Card number of the user.
 * @apiSuccess {String} user.Filename Avatar filename of the user.
 * @apiSuccess {Number} user.phone_number Phone number of the user.
 * @apiSuccess {String} user.email Email of the user.
 *
 * @apiSuccessExample {json} Success-Response:
 *    HTTP/1.1 200 OK
 *   {
 *    "ID": 1,
 *    "Firstname": "John",
 *    "Lastname": "Doe",
 *    "Address": "123 Main St",
 *    "Role": "Guest",
 *    "Username": "johndoe",
 *    "Password": "password",
 *    "Cardnumber": "1234567890",
 *    "Filename": "avatar.jpg",
 *    "phone_number": "123456789",
 *    "email": "johndoe@example.com",
 *   }
 *
 * @apiError UserNotFound The user with the specified username was not found.
 * @apiErrorExample {json} Error-Response:
 *    HTTP/1.1 404 Not Found
 *   {
 *     "message": "User not found"
 *   }
 *
 * @apiError ServerError Internal server error occurred while attempting to retrieve the user.
 * @apiErrorExample {json} Error-Response:
 *   HTTP/1.1 500 Internal Server Error
 *   {
 *     "message": "Failed to retrieve user"
 *   }
 *
 * @apiError BadRequest The username parameter is missing or not provided.
 * @apiErrorExample {json} BadRequest-Error-Response:
 *  HTTP/1.1 400 Bad Request
 *  {
 *     "message": "Missing username parameter"
 *  }
 */

/**
 * @api {put} /users/:name Update User
 * @apiName UpdateUser
 * @apiGroup User
 *
 * @apiParam {String} name The username of the user to update.
 *
 * @apiBody {Object} fields Key-value pairs of the fields to be updated.
 * @apiExample {json} Request-Example:
 *     {
 *       "Firstname": "Jane",
 *       "Lastname": "Doe",
 *       "Address": "321 New Address",
 *       "email": "janedoe@example.com"
 *     }
 *
 * @apiSuccess {String} message Confirmation message stating that the user was successfully updated.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Success."
 *     }
 *
 * @apiError NotFound No user found with the specified username or no changes made (no fields affected).
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 418 I'm a teapot
 *     {
 *       "message": "No user found or no updates made."
 *     }
 *
 * @apiError ServerError Internal server error occurred while attempting to update the user.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to update user",
 *       "error": "Detailed error description here"
 *     }
 */

/**
 * @api {delete} /users/:name Delete User
 * @apiName DeleteUser
 * @apiGroup User
 *
 * @apiParam {String} name The username of the user to be deleted.
 *
 * @apiSuccess {String} message Confirmation message stating that the user was successfully deleted.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "User successfully deleted"
 *     }
 *
 * @apiError NotFound The user with the specified username was not found or no user was deleted.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 418 I'm a teapot
 *     {
 *       "message": "User not found or not deleted"
 *     }
 *
 * @apiError ServerError Internal server error occurred while attempting to delete the user.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to delete user",
 *       "error": "Detailed error description here"
 *     }
 */

userRouter.route("/:name").get(getUser).put(updateUser).delete(deleteUser);

/**
 * @api {post} /orders Post New Order
 * @apiName PostOrder
 * @apiGroup Order
 *
 * @apiParam {Number} user_id The unique identifier of the user placing the order.
 *
 * @apiBody {Number} user_id ID of the user for whom the order is being placed.
 * @apiExample {json} Request-Example:
 *     {
 *       "user_id": 1
 *     }
 *
 * @apiSuccess {Object} order Details of the newly created order.
 * @apiSuccess {Number} order.order_id Unique identifier of the new order.
 * @apiSuccess {Number} order.userId ID of the user who placed the order.
 * @apiSuccess {String} order.date Date when the order was placed.
 * @apiSuccess {String} order.status Current status of the order.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "order_id": 101,
 *       "userId": 1,
 *       "date": "2024-05-01",
 *       "status": "Not started"
 *     }
 *
 * @apiError BadRequest Missing or invalid user_id provided.
 * @apiErrorExample {json} BadRequest-Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Invalid user_id"
 *     }
 *
 * @apiError ServerError Internal server error occurred while attempting to create the order.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to create order.",
 *       "error": "Error description here"
 *     }
 */

userRouter.route("/orders").post(postOrderController);

/**
 * @api {post} /register Register New User
 * @apiName RegisterUser
 * @apiGroup User
 *
 * @apiParam {File} [file] Optional avatar image file to upload.
 *
 * @apiBody {String} firstname User's first name.
 * @apiBody {String} lastname User's last name.
 * @apiBody {String} address User's address.
 * @apiBody {String} username User's chosen username.
 * @apiBody {String} password User's chosen password.
 * @apiBody {String} cardnumber User's card number.
 * @apiBody {String} phonenumber User's phone number.
 * @apiBody {String} email User's email address.
 * @apiExample {json} Request-Example:
 *     {
 *       "firstname": "John",
 *       "lastname": "Doe",
 *       "address": "123 Main St",
 *       "username": "johndoe",
 *       "password": "securepassword123",
 *       "cardnumber": "1234567890123456",
 *       "phonenumber": "123-456-7890",
 *       "email": "johndoe@example.com"
 *     }
 *
 * @apiSuccess {String} message Confirmation message stating that the user was successfully registered.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Success."
 *     }
 *
 * @apiError BadRequest Invalid or missing fields provided.
 * @apiErrorExample {json} BadRequest-Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Invalid or missing fields"
 *     }
 *
 * @apiError ServerError Internal server error occurred while attempting to register the user.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Post user error.",
 *       "error": "Error details here"
 *     }
 */

userRouter.route("/register").post(upload.single("file"), postUser);

/**
 * @api {post} /orders/items Add Items to Order
 * @apiName AddOrderItems
 * @apiGroup Order
 *
 * @apiBody {Number} orderId The unique identifier of the order.
 * @apiBody {Object[]} items Array of items to be added to the order.
 * @apiBody {Number} items.id The unique identifier of the burger/item.
 * @apiBody {Number} items.quantity The quantity of the burger/item to be added.
 * @apiExample {json} Request-Example:
 *     {
 *       "orderId": 1,
 *       "items": [
 *         {
 *           "id": 101,
 *           "quantity": 2
 *         },
 *         {
 *           "id": 102,
 *           "quantity": 3
 *         }
 *       ]
 *     }
 *
 * @apiSuccess {String} message Confirmation message stating that the order items were successfully added.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "message": "Order items successfully added"
 *     }
 *
 * @apiError BadRequest Missing or invalid fields provided.
 * @apiErrorExample {json} BadRequest-Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Invalid orderId or items"
 *     }
 *
 * @apiError ServerError Internal server error occurred while attempting to add items to the order.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to add order items",
 *       "error": "Error description here"
 *     }
 */

userRouter.post("/orders/items", addOrderItemsController);

/**
 * @api {put} /avatar/update Update User Avatar
 * @apiName UpdateAvatar
 * @apiGroup User
 *
 * @apiParam {File} file The new avatar image to upload.
 * @apiBody {String} username The username of the user whose avatar is being updated.
 *
 * @apiSuccess {Object} result Object containing the new avatar filename.
 * @apiSuccess {String} result.avatar Filename of the newly uploaded avatar.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "avatar": "new-avatar-filename.jpg"
 *     }
 *
 * @apiError NotFound The user with the specified username was not found or no update was made.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 418 I'm a teapot
 *     {
 *       "message": "No update was made"
 *     }
 *
 * @apiError ServerError Internal server error occurred while attempting to update the avatar.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to update avatar",
 *       "error": "Error description here"
 *     }
 */

userRouter.route("/avatar/update").put(upload.single("file"), updateAvatar);

/**
 * @api {get} /orders/:name Get Orders by Username
 * @apiName GetOrdersByName
 * @apiGroup Order
 *
 * @apiParam {String} name The username of the user whose orders are to be retrieved.
 *
 * @apiSuccess {Object[]} orders List of orders made by the user.
 * @apiSuccess {String} orders.name Name of the burger ordered.
 * @apiSuccess {Number} orders.quantity Quantity of the burger ordered.
 * @apiSuccess {String} orders.Date Date when the order was placed.
 * @apiSuccess {String} orders.Status Status of the order.
 * @apiSuccess {Number} orders.order_id Unique identifier of the order.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "name": "Classic Burger",
 *         "quantity": 2,
 *         "Date": "2024-05-01",
 *         "Status": "Completed",
 *         "order_id": 101
 *       }
 *     ]
 *
 * @apiError NotFound No orders found for the given username or incorrect username.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 418 I'm a teapot
 *     {
 *       "message": "No orders found for this username"
 *     }
 *
 * @apiError ServerError Internal server error occurred while attempting to retrieve the orders.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to retrieve orders",
 *       "error": "Error description here"
 *     }
 */

userRouter.route("/orders/:name").get(getOrdersByName);

/**
 * @api {get} /admin/orders/active Get Active Orders
 * @apiName GetActiveOrders
 * @apiGroup Order
 *
 * @apiSuccess {Object[]} orders List of active orders.
 * @apiSuccess {String} orders.name Name of the burger ordered.
 * @apiSuccess {Number} orders.quantity Quantity of each burger ordered.
 * @apiSuccess {String} orders.Date Date when the order was placed.
 * @apiSuccess {String} orders.Status Current status of the order.
 * @apiSuccess {Number} orders.order_id Unique identifier of the order.
 * @apiSuccess {String} orders.Firstname First name of the user who placed the order.
 * @apiSuccess {String} orders.Lastname Last name of the user who placed the order.
 * @apiSuccess {String} orders.Address Address of the user who placed the order.
 * @apiSuccess {String} orders.phone_number Phone number of the user who placed the order.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "name": "Spicy Chicken Burger",
 *         "quantity": 2,
 *         "Date": "2024-05-01",
 *         "Status": "Doing",
 *         "order_id": 10,
 *         "Firstname": "John",
 *         "Lastname": "Doe",
 *         "Address": "123 Main St",
 *         "phone_number": "123-456-7890"
 *       }
 *     ]
 *
 * @apiError ServerError Internal server error occurred while attempting to retrieve the orders.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to retrieve orders",
 *       "error": "Error description here"
 *     }
 */

/**
 * * @api {put} /admin/orders/active Update Order Status
 * @apiName UpdateOrderStatus
 * @apiGroup Order
 *
 * @apiBody {String} status The new status to be set for the order(s).
 * @apiBody {Number[]} orders Array of order IDs to be updated.
 * @apiExample {json} Request-Example:
 *     {
 *       "status": "Completed",
 *       "orders": [1001, 1002]
 *     }
 *
 * @apiSuccess {String} message Confirmation message stating that the order statuses were successfully updated.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Order statuses updated successfully."
 *     }
 *
 * @apiError NotFound No orders found to update or the provided data is invalid.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 418 I'm a teapot
 *     {
 *       "message": "No orders found or no updates made."
 *     }
 */

userRouter
  .route("/admin/orders/active")
  .get(getOrdersByStatus)
  .put(updateOrder);

export default userRouter;
