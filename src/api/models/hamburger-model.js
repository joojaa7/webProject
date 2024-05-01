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

export { getAllHamburgers, getBurgerById };
