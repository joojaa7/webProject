import promisePool from "../../utils/database.js";

const addSpecialOffer = async (
  offerName,
  description,
  price,
  startDate,
  endDate,
  burgerId,
  filename
) => {
  try {
    const sql = `
        INSERT INTO special_offers (offer_name, description, price, start_date, end_date, burger_id, filename)
        VALUES (?, ?, ?, ?, ?, ?, ?);
      `;
    const values = [
      offerName,
      description,
      price,
      startDate,
      endDate,
      burgerId,
      filename,
    ];
    const [result] = await promisePool.execute(sql, values);
    return {
      id: result.insertId,
      offerName,
      description,
      price,
      startDate,
      endDate,
      burgerId,
      filename,
    };
  } catch (error) {
    console.error("Error adding special offer:", error);
    throw error; // It's usually a good practice to rethrow the error unless you handle it specifically.
  }
};

export { addSpecialOffer };
