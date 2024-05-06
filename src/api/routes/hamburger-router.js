import express from "express";
import multer from "multer";
import {
  getAllHamburgersController,
  addBurgerController,
  getBurgerByIdController,
  deleteBurgerController,
} from "../controllers/hamburger-controller.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/burgers/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1]
    );
  },
});

const upload = multer({ storage: storage });

const hamburgerRouter = express.Router();

hamburgerRouter.delete("/:id", deleteBurgerController);
hamburgerRouter.get("/:id", getBurgerByIdController);
hamburgerRouter
  .route("/")
  .get(getAllHamburgersController)
  .post(upload.single("add-burger-upload-name"), addBurgerController);

export default hamburgerRouter;
