const mongoose = require("mongoose");
const RestaurantModel = require("../models/restaurant.model");
const Joi = require("joi");

/* -------------------------------------------------------------------------- */
/*                            JOI VALIDATION SCHEMAS                          */
/* -------------------------------------------------------------------------- */

// ✅ Schema for creation
const createRestaurantSchema = Joi.object({
  brandName: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  aboutText: Joi.string().min(20).max(1000).required(),
  socialMedia: Joi.array()
    .items(
      Joi.object({
        platform: Joi.string()
          .valid("facebook", "instagram", "twitter", "tiktok", "youtube")
          .required(),
        url: Joi.string().uri().required(),
      })
    )
    .optional(),
  website: Joi.string().uri().optional(),
  salesTaxRate: Joi.number().min(0).max(100).default(0),
  serviceTaxRate: Joi.number().min(0).max(100).default(0),
  subscriptionStart: Joi.date().default(Date.now),
  subscriptionEnd: Joi.date().allow(null),
});

// ✅ Schema for update
const updateRestaurantSchema = Joi.object({
  brandName: Joi.string().min(2).max(100),
  description: Joi.string().min(10).max(500),
  aboutText: Joi.string().min(20).max(1000),
  socialMedia: Joi.array().items(
    Joi.object({
      platform: Joi.string()
        .valid("facebook", "instagram", "twitter", "tiktok", "youtube")
        .required(),
      url: Joi.string().uri().required(),
    })
  ),
  website: Joi.string().uri(),
  salesTaxRate: Joi.number().min(0).max(100),
  serviceTaxRate: Joi.number().min(0).max(100),
  subscriptionStart: Joi.date(),
  subscriptionEnd: Joi.date().allow(null),
});

/* -------------------------------------------------------------------------- */
/*                              CREATE RESTAURANT                             */
/* -------------------------------------------------------------------------- */

const createRestaurant = async (req, res) => {
  try {
    const {
      brandName,
      description,
      aboutText,
      socialMedia,
      website,
      salesTaxRate,
      serviceTaxRate,
      subscriptionStart,
      subscriptionEnd,
    } = req.body;

    // Validate with Joi
    const { error } = createRestaurantSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details.map((d) => d.message) });

    // Check if brand name already exists
    const existing = await RestaurantModel.findOne({ brandName });
    if (existing)
      return res
        .status(409)
        .json({ success: false, message: "Brand name already exists" });

    // Handle uploaded images
    const logo = req.files?.logo?.[0]?.filename || null;
    const coverImage = req.files?.coverImage?.[0]?.filename || null;

    const newRestaurant = await RestaurantModel.create({
      brandName,
      description,
      aboutText,
      socialMedia,
      website,
      salesTaxRate,
      serviceTaxRate,
      subscriptionStart,
      subscriptionEnd,
      logo,
      coverImage,
    });

    return res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      data: newRestaurant,
    });
  } catch (error) {
    console.error("❌ Error creating restaurant:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating restaurant",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                             GET ALL RESTAURANTS                            */
/* -------------------------------------------------------------------------- */

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await RestaurantModel.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    console.error("❌ Error fetching restaurants:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching restaurants",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                              GET RESTAURANT BY ID                          */
/* -------------------------------------------------------------------------- */

const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid restaurant ID" });

    const restaurant = await RestaurantModel.findById(id);
    if (!restaurant)
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });

    return res.status(200).json({ success: true, data: restaurant });
  } catch (error) {
    console.error("❌ Error fetching restaurant:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching restaurant",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                              UPDATE RESTAURANT                             */
/* -------------------------------------------------------------------------- */

const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate restaurant ID 
    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid restaurant ID" });

    const {
      brandName,
      description,
      aboutText,
      socialMedia,
      website,
      salesTaxRate,
      serviceTaxRate,
      subscriptionStart,
      subscriptionEnd,
    } = req.body;

    const { error } = updateRestaurantSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error)
      return res
        .status(400)
        .json({ success: false, message: error.details.map((d) => d.message) });


    // Check if restaurant exists 
    const existingRestaurant = await RestaurantModel.findById(id);
    if (!existingRestaurant)
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });

    // Handle new uploaded images
    const logo = req.files?.logo?.[0]?.filename || existingRestaurant.logo;
    const coverImage =
      req.files?.coverImage?.[0]?.filename || existingRestaurant.coverImage;

    // Update restaurant details 
    const updatedRestaurant = await RestaurantModel.findByIdAndUpdate(
      id,
      {
        brandName,
        description,
        aboutText,
        socialMedia,
        website,
        salesTaxRate,
        serviceTaxRate,
        subscriptionStart,
        subscriptionEnd,
        logo,
        coverImage,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      data: updatedRestaurant,
    });
  } catch (error) {
    console.error("❌ Error updating restaurant:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating restaurant",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                              DELETE RESTAURANT                             */
/* -------------------------------------------------------------------------- */

const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid restaurant ID" });

    const restaurant = await RestaurantModel.findByIdAndDelete(id);
    if (!restaurant)
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });

    return res
      .status(200)
      .json({ success: true, message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting restaurant:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting restaurant",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                         UPDATE SUBSCRIPTION DATES (ADMIN)                  */
/* -------------------------------------------------------------------------- */

const updateSubscriptionDates = async (req, res) => {
  try {
    const employee = req.employee;

    if (!employee || employee.role !== "programer") {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. Only programmers can update subscription dates.",
      });
    }

    const { id } = req.params;
    const { subscriptionStart, subscriptionEnd } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid restaurant ID" });

    const restaurant = await RestaurantModel.findByIdAndUpdate(
      id,
      { subscriptionStart, subscriptionEnd },
      { new: true }
    );

    if (!restaurant)
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });

    return res.status(200).json({
      success: true,
      message: "Subscription dates updated successfully",
      data: restaurant,
    });
  } catch (error) {
    console.error("❌ Error updating subscription dates:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating subscription dates",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                 EXPORTS                                    */
/* -------------------------------------------------------------------------- */

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
  updateSubscriptionDates,
};
