import express from 'express';
import cors from 'cors';
import { getMe, login } from '../controllers/auth-controller.js';
import { authenticateToken } from '../../middlewares.js';

const authRouter = express.Router();

authRouter.use(cors());

authRouter.route('/').post(
    login
);

authRouter.route('/verify')
  .get(
    authenticateToken,
    getMe
  );

export default authRouter;