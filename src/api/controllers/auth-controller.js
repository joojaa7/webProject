import { getUser } from './user-controller.js';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const login = async (req, res) => {
  console.log('login', req.body);
  const loginUser = await getUser(req.body.username);
  console.log(loginUser)
  console.log(bcrypt.hashSync(req.body.password, 5));
  console.log(loginUser.Password);
  if (!loginUser) {
    console.log('noUser')
    res.sendStatus(401);
    return;
  }
  if (!bcrypt.compareSync(req.body.password, loginUser.Password)) {
    console.log('compare sync')
    res.sendStatus(401);
    return;
  }
  const userWithNoPassword = {
    username: loginUser.Username,
    avatar: loginUser.Filename,
    firstname: loginUser.Firstname,
    lastname: loginUser.Lastname,
    address: loginUser.Address,
    user_id: loginUser.ID,
    phone: loginUser.phone_number,
    email: loginUser.email,
    role: loginUser.Role
  };

  const token = jwt.sign(userWithNoPassword, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });
  console.log('Login', loginUser)
  res.json({user: userWithNoPassword, token});
};


const getMe = async (req, res) => {
  if (res.locals.user) {
    res.json({message: 'token ok', user: res.locals.user});
  } else {
    res.sendStatus(401);
  }
};

export { login, getMe };
