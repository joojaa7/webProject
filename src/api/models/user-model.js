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

export { getUserByName };