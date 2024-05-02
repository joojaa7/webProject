import promisePool from '../../utils/database.js';

const getUserByName = async (user) => {
  console.log('USERHERE', user)
    const [rows] = await promisePool.execute('SELECT * FROM users WHERE Username = ?', [user]);
    if (rows.length === 0){
        console.log(rows, 'Return false');
        return false;
      }
      return rows[0];
    };

const addUser = async (user, file) => {
  const {firstname, lastname, address, username, password, cardnumber, phonenumber} = user;
  const sql = `INSERT INTO users (Firstname, Lastname, Address, Role, Username, Password, Cardnumber, Filename, phone_number)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  const avatar = file?.filename || null;
  const data = [firstname, lastname, address, 'Guest', username, password, cardnumber, avatar, phonenumber];
  const rows = await promisePool.execute(sql, data);
  if (rows[0].affectedRows === 0){
    return false
  }
  console.log( 'Success.')
  return {user_id: rows[0].insertId};
}

const updateAvatarFilename = async (req) => {
  const sql = `UPDATE users SET Filename = ? WHERE username = ?`
  const data = [req.file.filename, req.body.username]
  const rows = await promisePool.execute(sql, data)
  if (rows[0].affectedRows === 0){
    return false
  }
  console.log('PUT success')
  if (req.file){
    return {avatar: req.file.filename}
  }
}

const updateUserInfo = async (req) => {
  try {
    for (const [key, value] of Object.entries(req.body)){
      const sql = `UPDATE users SET ${key} = ? WHERE username = ?`;
      const data = [value, req.params.name];
      const rows = await promisePool.execute(sql, data);
      console.log(rows, 'rows')
      if (rows[0].affectedRows === 0){
        return false
      }
    }
  } catch (e) {
    console.log(e)
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
  if (rows[0].affectedRows === 0){
    return false
  }
  return rows[0];
}

const getOrders = async () => {
  const sql = `SELECT name, quantity, Date, Status, join_orders.order_id, Firstname, Lastname, Address, phone_number FROM burgers 
              INNER JOIN join_orders ON join_orders.burger_id = burgers.ID 
              INNER JOIN order_history ON order_history.Order_id = join_orders.order_id 
              INNER JOIN users ON users.ID = order_history.User_id 
              WHERE NOT STATUS = 'Done'`;
  const rows = await promisePool.execute(sql);
  return rows[0];
}



export { getUserByName, addUser, updateAvatarFilename, updateUserInfo, getOrderHistory, getOrders };