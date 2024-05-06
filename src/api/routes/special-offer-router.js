import express from "express";
import multer from "multer";
import {
  addSpecialOfferController,
  getSpecialOffersController,
} from "../controllers/special-offer-controller.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/specials/");
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

const specialOfferRouter = express.Router();
specialOfferRouter.post(
  "/",
  upload.single("special-offer-upload-name"),
  addSpecialOfferController
);

specialOfferRouter.get("/", getSpecialOffersController);

export default specialOfferRouter;
