import promisePool from "../../utils/database.js";

const getAllIngredients = async () => {
  try {
    const [rows] = await promisePool.query("SELECT * FROM ingredients");
    return rows;
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    throw error; // It's a good practice to throw the error so it can be handled by the caller
  }
};

export { getAllIngredients };
