import express from 'express';
import { getUser, postUser, updateAvatar, updateUser } from "../controllers/user-controller.js";
import multer from 'multer';

const userRouter = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  
      const originalFilename = file.originalname.split('.')[0].toLowerCase();
      const prefix = `${originalFilename}-${file.fieldname}`;
  
      let extension = 'jpg';
  
      if (file.mimetype === 'image/png') {
        extension = 'png';
      }
  
      const filename = `${prefix}-${suffix}.${extension}`;
  
      cb(null, filename);
    },
  });
  
  const upload = multer({
    dest: 'uploads/',
    storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true)
      } else {
        const error = new Error("Only images are supported.")
        error.status = 400
        cb(error)
      }
    }
  });

userRouter.route('/:name')
  .get(
    getUser
  )
  .put(
    updateUser
  );

// TODO: add input validaton for null values, 
// avatar can be null.

userRouter.route('/register').post(
    upload.single('file'),
    postUser
);

userRouter
  .route('/avatar')
  .put(
    (req, res , next) => {
      console.log(req);
      next()
    }, 
    upload.single('file'),
    updateAvatar
)


export default userRouter;