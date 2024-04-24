import { getUserByName } from "../models/user-model.js";

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

export { getUser }