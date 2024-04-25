import promisePool from "../../utils/database.js";

const addMenuItem = async (burger_id, date) => {
  try {
    const [result] = await promisePool.execute(
      "INSERT INTO menu (burger_id, date) VALUES (?, ?)",
      [burger_id, date]
    );
    return { burger_id, date };
  } catch (error) {
    console.log("Error adding menu item:", error);
  }
};

export { addMenuItem };
