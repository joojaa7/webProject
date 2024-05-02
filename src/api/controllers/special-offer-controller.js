import { addSpecialOffer } from "../models/special-offer-model.js";

const addSpecialOfferController = async (req, res) => {
  try {
    // Extracting values from req.body and req.file
    const {
      "special-offer-name": offerName,
      "special-offer-description": description,
      "special-offer-price": price,
      "special-offer-start-date": startDate,
      "special-offer-end-date": endDate,
      "special-offer-burger": burgerId,
    } = req.body;

    const filename = req.file ? req.file.filename : null;

    console.log("full req.body", req.body);
    console.log("file in req body", req.file);

    const newOffer = await addSpecialOffer(
      offerName,
      description,
      price,
      startDate,
      endDate,
      burgerId,
      filename
    );

    res.status(201).json(newOffer);
  } catch (error) {
    console.error("Error in addSpecialOfferController:", error);
    res
      .status(500)
      .json({ message: "Failed to add special offer", error: error.message });
  }
};

export { addSpecialOfferController };
