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
    throw error;
  }
};

const getSpecialOffersByDate = async (fromDate) => {
  try {
    const [rows] = await promisePool.execute(
      `
        SELECT * FROM special_offers 
        WHERE end_date >= ?
        ORDER BY start_date ASC
        LIMIT 3
        `,
      [fromDate]
    );
    return rows;
  } catch (error) {
    console.error("Error fetching special offers starting from date:", error);
    throw error;
  }
};

export { addSpecialOffer, getSpecialOffersByDate };
