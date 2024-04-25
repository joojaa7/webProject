import { getUserByName, addUser } from "../models/user-model.js";
import bcrypt from 'bcrypt';

const getUser = async (req, res) => {
  console.log(req.params, "REQPARAMS");
    const user = await getUserByName(req.params.name);
    console.log('get user', user)
    if (user){
        return res.json(user);
      } else {
        return
      }
}

const postUser = async (req, res, next) => {
  req.body.password = bcrypt.hashSync(req.body.password, 5);
  try {
    const result = await addUser(req.body, req.file);
    if (!result) {
      const error = new Error("Invalid or missing fields")
      error.status = 400
      next(error);
      return;
    }
    res.status(200).send({message: 'Success.'});
    next();
  } catch (error) {
    console.log('Post user error.')
    next(error)
  }
};

export { getUser, postUser }