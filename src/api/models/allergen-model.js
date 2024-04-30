import promisePool from "../../utils/database.js";

const getAllAllergens = async () => {
  try {
    const [rows] = await promisePool.query("SELECT * FROM allergens");
    return rows;
  } catch (error) {
    console.error("Error fetching allergens:", error);
    throw error;
  }
};

async function fetchAllergensByBurgerId(burgerId) {
  const [allergens] = await promisePool.execute(
    `
      SELECT a.ID, a.acronym FROM allergens a
      JOIN join_allergens ja ON ja.allergens_id = a.ID
      WHERE ja.burger_id = ?
    `,
    [burgerId]
  );
  return allergens;
}

export { getAllAllergens, fetchAllergensByBurgerId };
