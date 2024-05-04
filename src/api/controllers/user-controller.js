import {
  getUserByName,
  addUser,
  updateAvatarFilename,
  updateUserInfo,
  getOrderHistory,
  getOrders,
  updateOrderStatus,
  addNewOrder,
  addOrderItems,
} from "../models/user-model.js";
import bcrypt from "bcrypt";

const postOrderController = async (req, res) => {
  //console.log("received body:", req.body);
  try {
    const { user_id } = req.body;
    //console.log("userId", user_id);
    const newOrder = await addNewOrder(user_id);
    res.status(201).json({ order_id: newOrder.orderId });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create order.", error: error.message });
  }
};

const getUser = async (username) => {
  console.log(username, "get user");
  const user = await getUserByName(username);
  console.log("get user", user);
  if (user) {
    return user;
  } else {
    return;
  }
};

const postUser = async (req, res, next) => {
  req.body.password = bcrypt.hashSync(req.body.password, 5);
  try {
    const result = await addUser(req.body, req.file);
    if (!result) {
      const error = new Error("Invalid or missing fields");
      error.status = 400;
      next(error);
      return;
    }
    res.status(200).send({ message: "Success." });
    next();
  } catch (error) {
    console.log("Post user error.");
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  const result = await updateAvatarFilename(req);
  if (!result) {
    res.sendStatus(418);
    return;
  }
  console.log("UPDATE AVATAR");
  //res.status(200).send({message: 'Success.'});
  res.json(result);
};

const updateUser = async (req, res, next) => {
  const result = await updateUserInfo(req);
  if (!result) {
    res.sendStatus(418);
    return;
  }
  res.status(200).send({ message: "Success." });
};

const getOrdersByName = async (req, res) => {
  const result = await getOrderHistory(req);
  if (!result) {
    res.sendStatus(418);
    return;
  }
  res.json(result);
};

const getOrdersByStatus = async (req, res) => {
  const result = await getOrders();
  res.json(result);
};

const updateOrder = async (req, res) => {
  const result = await updateOrderStatus(req);
  console.log(result);
  if (result) {
    res.sendStatus(200);
  }
};

const addOrderItemsController = async (req, res) => {
  const { orderId, items } = req.body;
  try {
    await addOrderItems(orderId, items);
    res.status(201).json({ message: "Order items successfully added" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add order items", error: error.message });
  }
};

export {
  getUser,
  postUser,
  updateAvatar,
  updateUser,
  getOrdersByName,
  getOrdersByStatus,
  updateOrder,
  postOrderController,
  addOrderItemsController,
};
