import { getAllIngredients } from "../models/ingredient-model.js"; // Adjust the path as necessary

const listAllIngredientsController = async (req, res) => {
  try {
    const ingredients = await getAllIngredients();
    res.json(ingredients);
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    res.status(500).json({
      message: "Failed to retrieve ingredients",
      error: error.message,
    });
  }
};
export { listAllIngredientsController };
