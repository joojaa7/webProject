import express from "express";

import {
  getAllCustomers,
  getCustomerWithId,
  getCustomerWithName,
  addNewCustomer,
  deleteCustomer,
  updateCustomer,
} from "../controllers/customer-controller.js";

const customerRouter = express.Router();

/**
 * @api {get} /customers/ List All Customers
 * @apiName GetAllCustomers
 * @apiGroup Customer
 *
 * @apiSuccess {Object[]} customers Array of all customers.
 * @apiSuccess {Number} customers.customer_id Customer's unique ID.
 * @apiSuccess {String} customers.name Name of the Customer.
 * @apiSuccess {String} customers.contact_info Contact information of the Customer, typically an email.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "customer_id": 1,
 *         "name": "John Doe",
 *         "contact_info": "johndoe@example.com"
 *       },
 *       {
 *         "customer_id": 2,
 *         "name": "Jane Smith",
 *         "contact_info": "janesmith@example.com"
 *       }
 *     ]
 *
 * @apiError CustomersFetchError Unable to fetch customers due to a server error.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to fetch customers",
 *       "error": "Detailed error message"
 *     }
 */

/**
 * @api {post} /customers/ Add New Customer
 * @apiName AddNewCustomer
 * @apiGroup Customer
 *
 * @apiParam {String} customer_name Name of the Customer.
 * @apiParam {String} contact_info Contact information of the Customer, typically an email.
 *
 * @apiSuccess {Object} customer Newly created customer details.
 * @apiSuccess {Number} customer.customer_id The ID of the newly created customer.
 * @apiSuccess {String} customer.name The name of the newly created customer.
 * @apiSuccess {String} customer.contact_info The contact information of the newly created customer.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "customer_id": 3,
 *       "name": "Alice Johnson",
 *       "contact_info": "alicejohnson@example.com"
 *     }
 *
 * @apiError CustomerCreationError Unable to create customer due to input error or server issue.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Invalid customer data provided"
 *     }
 */
customerRouter.route("/").get(getAllCustomers).post(addNewCustomer);

/**
 * @api {get} /customers/:id Get Customer by ID
 * @apiName GetCustomerById
 * @apiGroup Customer
 *
 * @apiParam {Number} id Unique identifier of the Customer.
 *
 * @apiSuccess {Number} customer_id ID of the Customer.
 * @apiSuccess {String} name Name of the Customer.
 * @apiSuccess {String} contact_info Contact information of the Customer, typically an email.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "customer_id": 1,
 *       "name": "John Doe",
 *       "contact_info": "johndoe@example.com"
 *     }
 *
 * @apiError CustomerNotFound No customer found with the provided ID.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Customer not found"
 *     }
 *
 * @apiError ServerError Internal server error.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to fetch customer by ID",
 *       "error": "Error description here"
 *     }
 */

/**
 * @api {delete} /customers/:id Delete Customer
 * @apiName DeleteCustomer
 * @apiGroup Customer
 *
 * @apiParam {Number} id Unique identifier of the Customer to delete.
 *
 * @apiSuccess {String} message Success message stating that the customer has been deleted.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Customer successfully deleted"
 *     }
 *
 * @apiError CustomerNotFound The customer could not be found or was already deleted.
 * @apiErrorExample {json} Customer-Not-Found-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Customer not found or already deleted"
 *     }
 *
 * @apiError ServerError Internal server error occurred while attempting to delete the customer.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to remove customer",
 *       "error": "Error description here"
 *     }
 */

/**
 * @api {put} /customers/:id Update Customer
 * @apiName UpdateCustomer
 * @apiGroup Customer
 *
 * @apiParam {Number} id Unique identifier of the Customer to update.
 * @apiParam {String} customer_name New name of the Customer.
 * @apiParam {String} contact_info New contact information of the Customer.
 *
 * @apiSuccess {String} message Success message confirming that the customer has been updated.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Customer successfully updated"
 *     }
 *
 * @apiError CustomerNotFound The customer with the given ID was not found.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Customer not found"
 *     }
 *
 * @apiError ServerError Internal server error occurred while attempting to update the customer.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to update customer",
 *       "error": "Detailed error description here"
 *     }
 */

customerRouter
  .route("/:id")
  .get(getCustomerWithId)
  .delete(deleteCustomer)
  .put(updateCustomer);

/**
 * @api {get} /customers/name/:name Get Customer by Name
 * @apiName GetCustomerByName
 * @apiGroup Customer
 *
 * @apiParam {String} name Name of the Customer to retrieve.
 *
 * @apiSuccess {Object[]} customers Array of customers with the specified name.
 * @apiSuccess {Number} customers.customer_id ID of the Customer.
 * @apiSuccess {String} customers.name Name of the Customer.
 * @apiSuccess {String} customers.contact_info Contact information of the Customer, typically an email.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "customer_id": 3,
 *         "name": "Alice Johnson",
 *         "contact_info": "alicejohnson@example.com"
 *       }
 *     ]
 *
 * @apiError CustomerNotFound No customer found with the provided name.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Customer not found"
 *     }
 *
 * @apiError ServerError Internal server error occurred while attempting to fetch the customer by name.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to fetch customer by name",
 *       "error": "Error description here"
 *     }
 */

customerRouter.route("/name/:name").get(getCustomerWithName);

export default customerRouter;
