import promisePool from "../../utils/database.js";

const formatDate = (date) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

const addNewOrder = async (userId) => {
  //console.log("userid in model", userId);
  const date = new Date(); // Get the current date and time
  const formattedDate = formatDate(date); // Format it to DD.MM.YYYY

  const status = "Not started";

  try {
    const [result] = await promisePool.execute(
      "INSERT INTO order_history (User_id, Date, Status) VALUES (?, ?, ?)",
      [userId, formattedDate, status]
    );
    return { orderId: result.insertId, userId, date: formattedDate, status };
  } catch (error) {
    console.error("Error adding new order:", error);
    throw error;
  }
};

const addOrderItems = async (orderId, items) => {
  try {
    items.forEach(async (item) => {
      const [result] = await promisePool.execute(
        "INSERT INTO join_orders (order_id, burger_id, quantity) VALUES (?, ?, ?)",
        [orderId, item.id, item.quantity]
      );
      console.log(`Added item ${item.id} to order ${orderId}`);
    });
  } catch (error) {
    console.error("Error adding order items:", error);
    throw error;
  }
};

const getUserByName = async (user) => {
  console.log("USERHERE", user);
  const [rows] = await promisePool.execute(
    "SELECT * FROM users WHERE Username = ?",
    [user]
  );
  if (rows.length === 0) {
    console.log(rows, "Return false");
    return false;
  }
  return rows[0];
};

const addUser = async (user, file) => {
  const {
    firstname,
    lastname,
    address,
    username,
    password,
    cardnumber,
    phonenumber,
    email
  } = user;
  const sql = `INSERT INTO users (Firstname, Lastname, Address, Role, Username, Password, Cardnumber, Filename, phone_number, email)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const avatar = file?.filename || null;
  const data = [
    firstname,
    lastname,
    address,
    "Guest",
    username,
    password,
    cardnumber,
    avatar,
    phonenumber,
    email
  ];
  const rows = await promisePool.execute(sql, data);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  console.log("Success.");
  return { user_id: rows[0].insertId };
};

const updateAvatarFilename = async (req) => {
  const sql = `UPDATE users SET Filename = ? WHERE username = ?`;
  const data = [req.file.filename, req.body.username];
  const rows = await promisePool.execute(sql, data);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  console.log("PUT success");
  if (req.file) {
    return { avatar: req.file.filename };
  }
};

const updateUserInfo = async (req) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      const sql = `UPDATE users SET ${key} = ? WHERE username = ?`;
      const data = [value, req.params.name];
      const rows = await promisePool.execute(sql, data);
      if (rows[0].affectedRows === 0) {
        return false;
      }
    }
  } catch (e) {
    console.log(e);
  }
  return true;
};

const getOrderHistory = async (req) => {
  const sql = `SELECT name, quantity, Date, Status, join_orders.order_id FROM burgers
               INNER JOIN join_orders ON join_orders.burger_id = burgers.ID 
               INNER JOIN order_history ON order_history.Order_id = join_orders.order_id 
               INNER JOIN users ON users.ID = order_history.User_id 
               WHERE users.Username = ?`;
  const data = [req.params.name];
  const rows = await promisePool.execute(sql, data);
  if (rows[0].affectedRows === 0) {
    return false;
  }
  return rows[0];
};

const getOrders = async () => {
  const sql = `SELECT name, quantity, Date, Status, join_orders.order_id, Firstname, Lastname, Address, phone_number FROM burgers 
              INNER JOIN join_orders ON join_orders.burger_id = burgers.ID 
              INNER JOIN order_history ON order_history.Order_id = join_orders.order_id 
              INNER JOIN users ON users.ID = order_history.User_id 
              WHERE NOT order_history.Status = 'Done'`;
  const rows = await promisePool.execute(sql);
  return rows[0];
};

const updateOrderStatus = async (req) => {
  console.log(req.body);
  req.body.orders.forEach(async (order) => {
    const sql = `UPDATE order_history SET Status = ? WHERE Order_id = ?`;
    const data = [req.body.status, order];
    const rows = await promisePool.execute(sql, data);
    if (rows[0].affectedRows === 0) {
      return false;
    }
  });
  return true;
};

export {
  getUserByName,
  addUser,
  updateAvatarFilename,
  updateUserInfo,
  getOrderHistory,
  getOrders,
  updateOrderStatus,
  addNewOrder,
  addOrderItems,
};
