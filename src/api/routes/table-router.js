import express from 'express';

import {
  getAllTables,
  getTableWithId,
  getTableLocationWithId,
  addNewTable,
  removeTableById,
  modifyExistingTable,
  getTablesByLocation,
  fetchTablesWithStatus,
} from '../controllers/table-controller.js';

const tableRouter = express.Router();

tableRouter.route('/').get(getAllTables).post(addNewTable);
tableRouter.route('/with-status').get(fetchTablesWithStatus);
tableRouter.route('/location/:location').get(getTablesByLocation);
tableRouter.route('/:id/location').get(getTableLocationWithId);
tableRouter
  .route('/:id')
  .get(getTableWithId)
  .delete(removeTableById)
  .put(modifyExistingTable);

export default tableRouter;
