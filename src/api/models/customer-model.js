import promisePool from '../../utils/database.js';

// Function to list all customers
const listAllCustomers = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM customers');
    return rows;
  } catch (err) {
    console.error('Error listing all customers:', err.message);
    throw err;
  }
};

// Function to get a customer by ID
const getCustomerById = async (customer_id) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM customers WHERE customer_id = ?',
      [customer_id]
    );
    return rows.length ? rows[0] : null;
  } catch (err) {
    console.error('Error getting customer by ID:', err.message);
    throw err;
  }
};

// Function to get a customer by name
const getCustomerByName = async (customer_name) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM customers WHERE name = ?',
      [customer_name]
    );
    return rows;
  } catch (err) {
    console.error('Error getting customer by name:', err.message);
    throw err;
  }
};

// Function to add a new customer
const addCustomer = async (customer_name, contact_info) => {
  try {
    const [result] = await promisePool.execute(
      'INSERT INTO customers (name, contact_info) VALUES (?, ?)',
      [customer_name, contact_info]
    );
    return {customer_id: result.insertId, name: customer_name, contact_info};
  } catch (err) {
    console.error('Error adding customer:', err.message);
    throw err;
  }
};

// Function to remove a customer by ID
const removeCustomer = async (customer_id) => {
  try {
    const [result] = await promisePool.execute(
      'DELETE FROM customers WHERE customer_id = ?',
      [customer_id]
    );
    return result.affectedRows;
  } catch (err) {
    console.error('Error removing customer:', err.message);
    throw err;
  }
};

// Function to modify a customer
const modifyCustomer = async (customer_id, customer_name, contact_info) => {
  try {
    const [result] = await promisePool.execute(
      'UPDATE customers SET name = ?, contact_info = ? WHERE customer_id = ?',
      [customer_name, contact_info, customer_id]
    );
    return result.affectedRows;
  } catch (err) {
    console.error('Error modifying customer:', err.message);
    throw err;
  }
};

export {
  listAllCustomers,
  getCustomerById,
  getCustomerByName,
  addCustomer,
  removeCustomer,
  modifyCustomer,
};
