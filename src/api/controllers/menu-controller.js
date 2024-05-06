import { addMenuItem, getMenuByDate } from "../models/menu-model.js";

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

const getMenuByDateController = async (req, res) => {
  const { date } = req.params;
  //console.log("date", date);
  try {
    const menuItems = await getMenuByDate(date);
    res.json(menuItems);
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({
      message: "Failed to retrieve menu",
      error: error.message,
    });
  }
};
export { addMenuItemController, getMenuByDateController };
