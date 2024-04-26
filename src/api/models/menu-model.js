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

const getMenuByDate = async (date) => {
  console.log("date in model", date);
  try {
    const [rows] = await promisePool.execute(
      "SELECT * FROM menu WHERE date = ?",
      [date]
    );
    console.log(rows);
    return rows;
  } catch (error) {
    console.log("Error fetching menu:", error);
  }
};

export { addMenuItem, getMenuByDate };
