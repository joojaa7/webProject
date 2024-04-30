import {
  getAllAllergens,
  fetchAllergensByBurgerId,
} from "../models/allergen-model.js";

const listAllAllergensController = async (req, res) => {
  try {
    const allergens = await getAllAllergens();
    res.json(allergens);
  } catch (error) {
    console.error("Error fetching allergens:", error);
    res.status(500).json({
      message: "Failed to retrieve allergens",
      error: error.message,
    });
  }
};

const listAllAllergensByBurgerIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const allergens = await fetchAllergensByBurgerId(id);
    res.json(allergens);
  } catch (error) {
    console.error("Error fetching allergens:", error);
    res.status(500).json({
      message: "Failed to retrieve allergens",
      error: error.message,
    });
  }
};

export { listAllAllergensController, listAllAllergensByBurgerIdController };
