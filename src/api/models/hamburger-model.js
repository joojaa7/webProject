import promisePool from "../../utils/database.js";

const getAllHamburgers = async () => {
  try {
    const [rows] = await promisePool.query("SELECT * FROM burgers");
    return rows;
  } catch (error) {
    console.log("Error fetching hamburgers:", error);
  }
};

const getBurgerById = async (id) => {
  try {
    const [rows] = await promisePool.execute(
      "SELECT * FROM burgers WHERE ID = ?",
      [id]
    );
    // console.log("rows in getburgerbyid", rows);
    return rows;
  } catch (error) {
    console.log("Error fetching burger:", error);
  }
};

const deleteBurgerById = async (burgerId) => {
  try {
    const [result] = await promisePool.execute(
      "DELETE FROM burgers WHERE ID = ?",
      [burgerId]
    );
    if (result.affectedRows === 0) {
      throw new Error("No burger found with the given ID.");
    }
    return { success: true, message: "Burger deleted successfully." };
  } catch (error) {
    console.error("Error deleting burger:", error);
    throw error;
  }
};

export { getAllHamburgers, getBurgerById, deleteBurgerById };
