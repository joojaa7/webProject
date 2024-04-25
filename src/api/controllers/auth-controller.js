import { getUser } from './user-controller.js';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const login = async (req, res) => {
  console.log('login', req.body);
  const loginUser = await getUser(req.body.username);
  if (!loginUser) {
    console.log('noUser')
    res.sendStatus(401);
    return;
  }
  if (!bcrypt.compareSync(req.body.password, loginUser.password)) {
    console.log('compare sync')
    res.sendStatus(401);
    return;
  }
  const userWithNoPassword = {
    username: loginUser.Username,
    avatar: loginUser.avatar,
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
