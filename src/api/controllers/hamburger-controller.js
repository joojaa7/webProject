import {
  getAllHamburgers,
  getBurgerById,
  deleteBurgerById,
} from "../models/hamburger-model.js";

import promisePool from "../../utils/database.js";

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
  const conn = await promisePool.getConnection();
  try {
    await conn.beginTransaction();

    const name = req.body["add-burger-name"];
    const description = req.body["add-burger-description"];
    const price = req.body["add-burger-price"];
    console.log("req.body:", req.body);
    const ingredients = req.body.ingredients
      .split(",")
      .map((ingredient) => ingredient.trim());
    const allergens = [].concat(req.body.allergens || []);

    const image = req.file ? req.file.filename : null;

    const [result] = await conn.execute(
      "INSERT INTO burgers (Name, Description, Price, filename) VALUES (?, ?, ?, ?)",
      [name, description, price, image]
    );
    const burgerId = result.insertId;

    const ingredientIds = await handleIngredients(ingredients, conn);
    await linkIngredientsToBurger(ingredientIds, burgerId, conn); // Link ingredients to the burger
    await linkAllergensToBurger(allergens, burgerId, conn);

    await conn.commit();
    res.status(201).json({ id: burgerId, name, description, price, image });
  } catch (error) {
    console.error("Error in addBurgerController:", error);
    await conn.rollback();
    res
      .status(500)
      .json({ message: "Failed to add burger", error: error.toString() });
  } finally {
    conn.release();
  }
};

const handleIngredients = async (ingredients, conn) => {
  let ingredientIds = [];
  for (const ingredientName of ingredients) {
    const [rows] = await conn.execute(
      "SELECT ID FROM ingredients WHERE Name = ?",
      [ingredientName]
    );
    if (rows.length === 0) {
      const [result] = await conn.execute(
        "INSERT INTO ingredients (Name) VALUES (?)",
        [ingredientName]
      );
      ingredientIds.push(result.insertId);
    } else {
      ingredientIds.push(rows[0].ID);
    }
  }
  return ingredientIds;
};

const linkAllergensToBurger = async (allergenIds, burgerId, conn) => {
  for (const allergenId of allergenIds) {
    await conn.execute(
      "INSERT INTO join_allergens (allergens_id, burger_id) VALUES (?, ?)",
      [allergenId, burgerId]
    );
  }
};

const linkIngredientsToBurger = async (ingredientIds, burgerId, conn) => {
  for (const ingredientId of ingredientIds) {
    await conn.execute(
      "INSERT INTO join_ingredients (ingredient_id, burger_id) VALUES (?, ?)",
      [ingredientId, burgerId]
    );
  }
};

const deleteBurgerController = async (req, res) => {
  const burgerId = req.params.id;

  try {
    const result = await deleteBurgerById(burgerId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in deleteBurgerController:", error);
    res.status(500).json({
      message: "Failed to delete burger",
      error: error.message,
    });
  }
};

export {
  getAllHamburgersController,
  addBurgerController,
  getBurgerByIdController,
  deleteBurgerController,
};
