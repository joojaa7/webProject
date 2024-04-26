import {
  getAllHamburgers,
  addBurger,
  getBurgerById,
} from "../models/hamburger-model.js";

const getAllHamburgersController = async (req, res) => {
  try {
    const hamburgers = await getAllHamburgers();
    res.json(hamburgers);
  } catch (error) {
    console.log("Error fetching hamburgers:", error);
    res.status(500).json({
      message: "Failed to retrieve hamburgers",
      error: error.message,
    });
  }
};

const getBurgerByIdController = async (req, res) => {
  const { id } = req.params;
  console.log("ID:", id);
  try {
    const burger = await getBurgerById(id);
    res.json(burger);
  } catch (error) {
    console.log("Error fetching burger:", error);
    res.status(500).json({
      message: "Failed to retrieve burger",
      error: error.message,
    });
  }
};

const addBurgerController = async (req, res) => {
  const { name, description, price, image } = req.body;
  try {
    const newBurger = await addBurger(name, description, price, image);
    res.status(201).json(newBurger);
  } catch (error) {
    console.log("Error adding burger:", error);
    res.status(500).json({
      message: "Failed to add burger",
      error: error.message,
    });
  }
};

export {
  getAllHamburgersController,
  addBurgerController,
  getBurgerByIdController,
};
