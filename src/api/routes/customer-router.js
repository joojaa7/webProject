import express from 'express';

import {
  getAllCustomers,
  getCustomerWithId,
  getCustomerWithName,
  addNewCustomer,
  deleteCustomer,
  updateCustomer,
} from '../controllers/customer-controller.js';

const customerRouter = express.Router();

customerRouter.route('/').get(getAllCustomers).post(addNewCustomer);
customerRouter
  .route('/:id')
  .get(getCustomerWithId)
  .delete(deleteCustomer)
  .put(updateCustomer);
customerRouter.route('/name/:name').get(getCustomerWithName);

export default customerRouter;
