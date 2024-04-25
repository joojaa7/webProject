import promisePool from '../../utils/database.js';

const getUserByName = async (user) => {
  console.log('USERHERE', user)
    const [rows] = await promisePool.execute('SELECT * FROM users WHERE Firstname = ?', [user]);
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

export { getUserByName, addUser, updateAvatarFilename };