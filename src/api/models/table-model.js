import promisePool from '../../utils/database.js';

const listAllTables = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM tables');
    return rows;
  } catch (err) {
    console.error('listAllTables Error:', err.message);
    throw err;
  }
};

// Function to get a table by ID
const getTableById = async (tableId) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM tables WHERE table_id = ?',
      [tableId]
    );
    return rows.length > 0 ? rows[0] : null; // return null if no table is found
  } catch (err) {
    console.error('getTableById Error:', err.message);
    throw err;
  }
};

// Function to get the location of a table by ID
const getTableLocationById = async (tableId) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT location FROM tables WHERE table_id = ?',
      [tableId]
    );
    return rows.length > 0 ? rows[0].location : null; // return null if no location is found
  } catch (err) {
    console.error('getTableLocationById Error:', err.message);
    throw err;
  }
};

// Function to add a new table
const addTable = async (capacity, location) => {
  try {
    const [result] = await promisePool.execute(
      'INSERT INTO tables (capacity, location) VALUES (?, ?)',
      [capacity, location]
    );
    return {id: result.insertId, capacity, location};
  } catch (err) {
    console.error('addTable Error:', err.message);
    throw err;
  }
};

// Function to remove a table by ID
const removeTable = async (tableId) => {
  try {
    const [result] = await promisePool.execute(
      'DELETE FROM tables WHERE table_id = ?',
      [tableId]
    );
    return result.affectedRows; // Returns the number of affected rows (0 if no rows deleted)
  } catch (err) {
    console.error('removeTable Error:', err.message);
    throw err;
  }
};

// Function to modify an existing table
const modifyTable = async (tableId, capacity, location) => {
  try {
    const [result] = await promisePool.execute(
      'UPDATE tables SET capacity = ?, location = ? WHERE table_id = ?',
      [capacity, location, tableId]
    );
    return result.affectedRows; // Returns the number of affected rows (0 if no rows updated)
  } catch (err) {
    console.error('modifyTable Error:', err.message);
    throw err;
  }
};

const listTablesByLocation = async (location) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM tables WHERE location = ?',
      [location]
    );
    return rows; // Returns an array of tables at the specified location
  } catch (err) {
    console.error('listTablesByLocation Error:', err.message);
    throw err;
  }
};

const getTablesWithStatus = async () => {
  const sql = `
      SELECT t.table_id, t.capacity, t.location, MAX(r.status) as status
      FROM tables t
      LEFT JOIN reservations r ON t.table_id = r.table_id
      GROUP BY t.table_id, t.capacity, t.location
      ORDER BY MAX(r.reservation_id) DESC;
  `;
  try {
    const [rows] = await promisePool.query(sql);
    return rows;
  } catch (err) {
    console.error('Error fetching tables with statuses:', err);
    throw err;
  }
};

export {
  listAllTables,
  getTableById,
  getTableLocationById,
  addTable,
  removeTable,
  modifyTable,
  listTablesByLocation,
  getTablesWithStatus,
};
