import {
  listAllCustomers,
  getCustomerById,
  getCustomerByName,
  addCustomer,
  removeCustomer,
  modifyCustomer,
} from '../models/customer-model.js';

const getAllCustomers = async (req, res) => {
  try {
    const customers = await listAllCustomers();
    res.json(customers);
  } catch (err) {
    console.error('Error fetching all customers:', err);
    res
      .status(500)
      .send({message: 'Failed to fetch customers', error: err.message});
  }
};

const getCustomerWithId = async (req, res) => {
  const {id} = req.params;
  try {
    const customer = await getCustomerById(id);
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).send({message: 'Customer not found'});
    }
  } catch (err) {
    console.error('Error fetching customer by ID:', err);
    res
      .status(500)
      .send({message: 'Failed to fetch customer by ID', error: err.message});
  }
};

const getCustomerWithName = async (req, res) => {
  const {name} = req.params;
  try {
    const customer = await getCustomerByName(name);
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).send({message: 'Customer not found'});
    }
  } catch (err) {
    console.error('Error fetching customer by name:', err);
    res
      .status(500)
      .send({message: 'Failed to fetch customer by name', error: err.message});
  }
};

const addNewCustomer = async (req, res) => {
  const {customer_name, contact_info} = req.body;
  try {
    const newCustomer = await addCustomer(customer_name, contact_info);
    res.status(201).json(newCustomer);
  } catch (err) {
    console.error('Error adding new customer:', err);
    res
      .status(500)
      .send({message: 'Failed to add new customer', error: err.message});
  }
};

const deleteCustomer = async (req, res) => {
  const {id} = req.params;
  try {
    const result = await removeCustomer(id);
    if (result > 0) {
      res.status(200).send({message: 'Customer successfully deleted'});
    } else {
      res.status(404).send({message: 'Customer not found or already deleted'});
    }
  } catch (error) {
    console.error('Error deleting customer:', error);
    res
      .status(500)
      .send({message: 'Failed to remove customer', error: err.message});
  }
};

const updateCustomer = async (req, res) => {
  const {id} = req.params;
  const {customer_name, contact_info} = req.body;
  try {
    const result = await modifyCustomer(id, customer_name, contact_info);
    if (result) {
      res.status(200).json({message: 'Customer successfully updated'});
    } else {
      res.status(404).send({message: 'Customer not found'});
    }
  } catch (error) {
    console.error('Error updating customer:', error);
    res
      .status(500)
      .send({message: 'Failed to update customer', error: error.message});
  }
};

export {
  getAllCustomers,
  getCustomerWithId,
  getCustomerWithName,
  addNewCustomer,
  deleteCustomer,
  updateCustomer,
};
