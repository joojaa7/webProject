import {
  listAllTables,
  getTableById,
  getTableLocationById,
  addTable,
  removeTable,
  modifyTable,
  listTablesByLocation,
  getTablesWithStatus,
} from '../models/table-model.js';

// Function to get all tables
const getAllTables = async (req, res) => {
  try {
    const tables = await listAllTables();
    res.json(tables);
  } catch (err) {
    console.error('Error fetching all tables:', err);
    res
      .status(500)
      .send({message: 'Failed to fetch tables', error: err.message});
  }
};

// Function to get a single table by ID
const getTableWithId = async (req, res) => {
  const {id} = req.params; // Get the table ID from the URL parameter
  try {
    const table = await getTableById(id);
    if (table) {
      res.json(table);
    } else {
      res.status(404).send({message: 'Table not found asdsa'});
    }
  } catch (err) {
    console.error('Error fetching table by ID:', err);
    res
      .status(500)
      .send({message: 'Failed to fetch table by ID', error: err.message});
  }
};

// Function to get the location of a single table by ID
const getTableLocationWithId = async (req, res) => {
  const {id} = req.params;
  try {
    const location = await getTableLocationById(id);
    if (location !== null) {
      res.json({table_id: id, location});
    } else {
      res.status(404).send({message: 'Table location not found'});
    }
  } catch (err) {
    console.error('Error fetching table location by ID:', err);
    res.status(500).send({
      message: 'Failed to fetch table location by ID',
      error: err.message,
    });
  }
};

const addNewTable = async (req, res) => {
  const {capacity, location} = req.body; // Extract capacity and location from request body
  try {
    const newTable = await addTable(capacity, location);
    res.status(201).json(newTable);
  } catch (err) {
    console.error('Error adding new table:', err);
    res
      .status(500)
      .send({message: 'Failed to add new table', error: err.message});
  }
};

// Function to remove a table by ID
const removeTableById = async (req, res) => {
  const {id} = req.params; // Get the table ID from URL parameters
  try {
    const affectedRows = await removeTable(id);
    if (affectedRows > 0) {
      res.status(200).send({message: 'Table successfully deleted'});
    } else {
      res.status(404).send({message: 'Table not found or already deleted'});
    }
  } catch (err) {
    console.error('Error removing table:', err);
    res
      .status(500)
      .send({message: 'Failed to remove table', error: err.message});
  }
};

// Function to modify an existing table
const modifyExistingTable = async (req, res) => {
  const {id} = req.params; // Table ID from URL parameters
  const {capacity, location} = req.body; // Updated capacity and location from request body
  try {
    const affectedRows = await modifyTable(id, capacity, location);
    if (affectedRows > 0) {
      res.status(200).json({message: 'Table successfully updated'});
    } else {
      res.status(404).send({message: 'Table not found or no changes made'});
    }
  } catch (err) {
    console.error('Error modifying table:', err);
    res
      .status(500)
      .send({message: 'Failed to modify table', error: err.message});
  }
};

const getTablesByLocation = async (req, res) => {
  const {location} = req.params; // Assuming location is passed as a URL parameter
  try {
    const tables = await listTablesByLocation(location);
    if (tables.length > 0) {
      res.json(tables);
    } else {
      res
        .status(404)
        .send({message: 'No tables found for the specified location'});
    }
  } catch (err) {
    console.error('getTablesByLocation Error:', err);
    res
      .status(500)
      .send({message: 'Error retrieving tables', error: err.message});
  }
};

const fetchTablesWithStatus = async (req, res) => {
  try {
    const tables = await getTablesWithStatus();
    console.log('Tables with statuses:', tables);
    res.json(tables);
  } catch (error) {
    console.error('Failed to retrieve tables with statuses:', error);
    res.status(500).send({
      message: 'Failed to retrieve tables with statuses',
      error: error.message,
    });
  }
};

export {
  getAllTables,
  getTableWithId,
  getTableLocationWithId,
  addNewTable,
  removeTableById,
  modifyExistingTable,
  getTablesByLocation,
  fetchTablesWithStatus,
};
