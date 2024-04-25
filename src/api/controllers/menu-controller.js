import { addMenuItem } from "../models/menu-model.js";

const addMenuItemController = async (req, res) => {
  const { burger_id, date } = req.body;
  try {
    const newMenuItem = await addMenuItem(burger_id, date);
    res.status(201).json(newMenuItem);
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).json({
      message: "Failed to add menu item",
      error: error.message,
    });
  }
};

export { addMenuItemController };
