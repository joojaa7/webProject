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

/**
 * @api {post} /special_offers/ Add Special Offer
 * @apiName AddSpecialOffer
 * @apiGroup SpecialOffers
 *
 * @apiParam {File} [special-offer-upload-name] Image file for the special offer (optional).
 * @apiParam {String} special-offer-name Name of the special offer.
 * @apiParam {String} special-offer-description Description of the special offer.
 * @apiParam {Number} special-offer-price Price of the special offer.
 * @apiParam {String} special-offer-start-date Start date of the special offer (format: YYYY-MM-DD).
 * @apiParam {String} special-offer-end-date End date of the special offer (format: YYYY-MM-DD).
 * @apiParam {Number} special-offer-burger ID of the burger associated with the offer.
 *
 * @apiSuccess {Object} offer Details of the newly added special offer.
 * @apiSuccess {Number} offer.id Unique identifier of the special offer.
 * @apiSuccess {String} offer.offerName Name of the special offer.
 * @apiSuccess {String} offer.description Description of the special offer.
 * @apiSuccess {Number} offer.price Price of the special offer.
 * @apiSuccess {String} offer.startDate Start date of the special offer.
 * @apiSuccess {String} offer.endDate End date of the special offer.
 * @apiSuccess {Number} offer.burgerId ID of the burger associated with the offer.
 * @apiSuccess {String} offer.filename Filename of the uploaded image (if provided).
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "id": 101,
 *       "offerName": "Summer Special",
 *       "description": "A refreshing summer burger with a light, spicy touch.",
 *       "price": 15.99,
 *       "startDate": "2024-06-01",
 *       "endDate": "2024-08-31",
 *       "burgerId": 5,
 *       "filename": "special-offer-upload-name-1627281849317.jpg"
 *     }
 *
 * @apiError BadRequest The required fields were not provided or were invalid.
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Missing required special offer details"
 *     }
 *
 * @apiError ServerError Internal server error occurred while attempting to add the special offer.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to add special offer",
 *       "error": "Detailed error description here"
 *     }
 */

specialOfferRouter.post(
  "/",
  upload.single("special-offer-upload-name"),
  addSpecialOfferController
);

/**
 * @api {get} /special_offers/ Get Special Offers by Date
 * @apiName GetSpecialOffers
 * @apiGroup SpecialOffers
 *
 * @apiParam {String} date Mandatory date parameter to filter offers that end after this date (format: YYYY-MM-DD).
 *
 * @apiSuccess {Object[]} specialOffers List of special offers that are active from the specified date.
 * @apiSuccess {Number} specialOffers.offer_id Unique identifier of the special offer.
 * @apiSuccess {String} specialOffers.start_date Start date of the special offer.
 * @apiSuccess {String} specialOffers.end_date End date of the special offer.
 * @apiSuccess {String} specialOffers.offer_name Name of the special offer.
 * @apiSuccess {String} specialOffers.burger_id ID of the burger associated with the offer.
 * @apiSuccess {String} specialOffers.description Description of the special offer.
 * @apiSuccess {Number} specialOffers.price Price of the special offer.
 *
 * @apiSuccess {String} specialOffers.filename Filename of the offer image if available.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "offer_id": 101,
 *         "start_date": "2024-12-01",
 *         "end_date": "2024-12-31",
 *         "offer_name": "Winter Feast",
 *         "burger_id": 5,
 *         "description": "Enjoy our winter special at a discounted price!",
 *         "price": 19.99,
 *
 *         "filename": "winter-feast-20241201.jpg"
 *       }
 *     ]
 *
 * @apiError BadRequest The date parameter is missing or not provided in the correct format.
 * @apiErrorExample {json} BadRequest-Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "Missing or invalid date format, expected YYYY-MM-DD"
 *     }
 *
 * @apiError ServerError Internal server error occurred while attempting to retrieve the special offers.
 * @apiErrorExample {json} Server-Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to retrieve special offers",
 *       "error": "Error description here"
 *     }
 */

specialOfferRouter.get("/", getSpecialOffersController);

export default specialOfferRouter;
