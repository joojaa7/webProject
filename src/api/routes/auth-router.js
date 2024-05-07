import express from "express";
import cors from "cors";
import { getMe, login } from "../controllers/auth-controller.js";
import { authenticateToken } from "../../middlewares.js";

const authRouter = express.Router();

authRouter.use(cors());

/**
 * @api {post} /auth/ Login
 * @apiName Login
 * @apiGroup Authentication
 *
 * @apiParam {String} username Username of the user.
 * @apiParam {String} password Password of the user.
 *
 * @apiSuccess {Object} user User's data without password.
 * @apiSuccess {String} user.username Username of the logged-in user.
 * @apiSuccess {String} [user.avatar] Avatar filename of the user.
 * @apiSuccess {String} user.firstname First name of the user.
 * @apiSuccess {String} user.lastname Last name of the user.
 * @apiSuccess {String} user.address Address of the user.
 * @apiSuccess {Number} user.user_id Unique identifier of the user.
 * @apiSuccess {String} user.phone Phone number of the user.
 * @apiSuccess {String} user.email Email of the user.
 * @apiSuccess {String} user.role Role of the user.
 * @apiSuccess {String} token JWT token for authentication in subsequent requests.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "user": {
 *         "username": "johndoe",
 *         "avatar": "profile.jpg",
 *         "firstname": "John",
 *         "lastname": "Doe",
 *         "address": "123 Main St",
 *         "user_id": 101,
 *         "phone": "123-456-7890",
 *         "email": "johndoe@example.com",
 *         "role": "admin"
 *       },
 *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     }
 *
 * @apiError Unauthorized Incorrect username or password.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Incorrect username or password"
 *     }
 */

authRouter.route("/").post(login);

/**
 * @api {get} /auth/verify Verify Token
 * @apiName VerifyToken
 * @apiGroup Authentication
 *
 * @apiHeader {String} authorization Token as a Bearer token.
 *
 * @apiSuccess {String} message Confirmation message indicating the token is valid.
 * @apiSuccess {Object} user The user information decoded from the token.
 * @apiSuccess {String} user.username Username of the user.
 * @apiSuccess {String} [user.avatar] Avatar filename of the user.
 * @apiSuccess {String} user.firstname First name of the user.
 * @apiSuccess {String} user.lastname Last name of the user.
 * @apiSuccess {String} user.address Address of the user.
 * @apiSuccess {Number} user.user_id Unique identifier of the user.
 * @apiSuccess {String} user.phone Phone number of the user.
 * @apiSuccess {String} user.email Email of the user.
 * @apiSuccess {String} user.role Role of the user.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "token ok",
 *       "user": {
 *         "username": "johndoe",
 *         "avatar": "profile.jpg",
 *         "firstname": "John",
 *         "lastname": "Doe",
 *         "address": "123 Main St",
 *         "user_id": 101,
 *         "phone": "123-456-7890",
 *         "email": "johndoe@example.com",
 *         "role": "admin"
 *       }
 *     }
 *
 * @apiError Unauthorized The token is missing or null.
 * @apiErrorExample {json} Unauthorized-Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Unauthorized access, token required"
 *     }
 *
 * @apiError Forbidden The token is invalid or expired.
 * @apiErrorExample {json} Forbidden-Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "message": "invalid token"
 *     }
 */

authRouter.route("/verify").get(authenticateToken, getMe);

export default authRouter;
