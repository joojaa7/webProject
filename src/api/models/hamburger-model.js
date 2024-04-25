import promisePool from "../../utils/database.js";

const getAllHamburgers = async () => {
  try {
    const [rows] = await promisePool.query("SELECT * FROM burgers");
    return rows;
  } catch (error) {
    console.log("Error fetching hamburgers:", error);
  }
};

// TODO: finish router for uploading files
const addBurger = async (name, description, price, image) => {
  try {
    const [result] = await promisePool.execute(
      "INSERT INTO burgers (Name, Description, Price, filename) VALUES (?, ?, ?, ?)",
      [name, description, price, image]
    );
    return { name, description, price, image };
  } catch (error) {
    console.log("Error adding burger:", error);
  }
};

export { getAllHamburgers, addBurger };
