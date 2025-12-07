const mongoose = require("mongoose");
const BrandModel = require("../models/brand.model");
const Joi = require("joi");
const fs = require("fs");
const path = require("path");

/* -------------------------------------------------------------------------- */
/*                            JOI VALIDATION SCHEMAS                          */
/* -------------------------------------------------------------------------- */

const createBrandSchema = Joi.object({
  dashboardLanguages: Joi.array()
    .items(
      Joi.string().valid("en", "ar", "fr", "es", "de", "it", "zh", "ja", "ru")
    )
    .min(1)
    .max(2)
    .required(),
  menuLanguages: Joi.array()
    .items(
      Joi.string().valid("en", "ar", "fr", "es", "de", "it", "zh", "ja", "ru")
    )
    .min(1)
    .max(3)
    .required(),
  brandName: Joi.object().required(),
  description: Joi.object().optional(),
  aboutText: Joi.object().optional(),
  socialMedia: Joi.array()
    .items(
      Joi.object({
        platform: Joi.string()
          .valid("facebook", "instagram", "twitter", "tiktok", "youtube", "other")
          .required(),
        url: Joi.string().uri().required(),
        description: Joi.string().optional(),
      })
    )
    .optional(),
  website: Joi.string().uri().optional(),
  countOfBranches: Joi.number().min(1).max(50).default(1),
  salesTaxRate: Joi.number().min(0).max(100).default(0),
  serviceTaxRate: Joi.number().min(0).max(100).default(0),
});

const updateBrandSchema = Joi.object({
  dashboardLanguages: Joi.array().items(
    Joi.string().valid("en", "ar", "fr", "es", "de", "it", "zh", "ja", "ru")
  ),
  menuLanguages: Joi.array().items(
    Joi.string().valid("en", "ar", "fr", "es", "de", "it", "zh", "ja", "ru")
  ),
  brandName: Joi.object(),
  description: Joi.object(),
  aboutText: Joi.object(),
  socialMedia: Joi.array().items(
    Joi.object({
      platform: Joi.string()
        .valid("facebook", "instagram", "twitter", "tiktok", "youtube", "other")
        .required(),
      url: Joi.string().uri().required(),
      description: Joi.string().optional(),
    })
  ),
  website: Joi.string().uri(),
  countOfBranches: Joi.number().min(1).max(50),
  salesTaxRate: Joi.number().min(0).max(100),
  serviceTaxRate: Joi.number().min(0).max(100),
});

/* -------------------------------------------------------------------------- */
/*                              CREATE BRAND                                  */
/* -------------------------------------------------------------------------- */

const createBrand = async (req, res) => {
  try {
    const { error } = createBrandSchema.validate(req.body, { abortEarly: false });
    if (error)
      return res.status(400).json({ success: false, message: error.details.map(d => d.message) });

    const owner = req.employee?._id;
    if (!owner || req.employee.isOwner !== true)
      return res.status(403).json({ success: false, message: "Only owners can create Brand" });

    const existingBrand = await BrandModel.countDocuments();
    if (existingBrand >= 1)
      return res.status(409).json({ success: false, message: "Brand already exists" });

    const logo = req.files?.logo?.[0]?.filename || null;
    const coverImage = req.files?.coverImage?.[0]?.filename || null;

    const newBrand = await BrandModel.create({
      ...req.body,
      owner,
      logo,
      coverImage,
    });

    return res.status(201).json({ success: true, message: "Brand created successfully", data: newBrand });
  } catch (err) {
    console.error("❌ Error creating Brand:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* -------------------------------------------------------------------------- */
/*                             GET BRANDS                                      */
/* -------------------------------------------------------------------------- */

const getAllBrands = async (req, res) => {
  try {
    const brands = await BrandModel.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: brands.length, data: brands });
  } catch (err) {
    console.error("❌ Error fetching Brands:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid Brand ID" });

    const brand = await BrandModel.findById(id);
    if (!brand)
      return res.status(404).json({ success: false, message: "Brand not found" });

    return res.status(200).json({ success: true, data: brand });
  } catch (err) {
    console.error("❌ Error fetching Brand:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* -------------------------------------------------------------------------- */
/*                             UPDATE BRAND                                   */
/* -------------------------------------------------------------------------- */

const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid Brand ID" });

    const { error } = updateBrandSchema.validate(req.body, { abortEarly: false });
    if (error)
      return res.status(400).json({ success: false, message: error.details.map(d => d.message) });

    const existing = await BrandModel.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: "Brand not found" });

    const logo = req.files?.logo?.[0]?.filename || existing.logo;
    const coverImage = req.files?.coverImage?.[0]?.filename || existing.coverImage;

    const updatedBrand = await BrandModel.findByIdAndUpdate(
      id,
      { ...req.body, logo, coverImage },
      { new: true, runValidators: true }
    );

    return res.status(200).json({ success: true, message: "Brand updated successfully", data: updatedBrand });
  } catch (err) {
    console.error("❌ Error updating Brand:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* -------------------------------------------------------------------------- */
/*                   SOFT DELETE / RESTORE / PERMANENT DELETE                  */
/* -------------------------------------------------------------------------- */

const softDeleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid Brand ID" });

    const brand = await BrandModel.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );
    if (!brand) return res.status(404).json({ success: false, message: "Brand not found" });

    return res.status(200).json({ success: true, message: "Brand soft deleted successfully", data: brand });
  } catch (err) {
    console.error("❌ Error soft deleting Brand:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const restoreBrand = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid Brand ID" });

    const brand = await BrandModel.findByIdAndUpdate(
      id,
      { isDeleted: false, deletedAt: null },
      { new: true }
    );
    if (!brand) return res.status(404).json({ success: false, message: "Brand not found" });

    return res.status(200).json({ success: true, message: "Brand restored successfully", data: brand });
  } catch (err) {
    console.error("❌ Error restoring Brand:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const deleteBrandPermanently = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid Brand ID" });

    const linkedBranches = await BranchModel.find({ brand: id });
    if (linkedBranches.length > 0)
      return res.status(403).json({
        success: false,
        message: "Cannot delete Brand permanently while branches exist",
      });

    const brand = await BrandModel.findByIdAndDelete(id);
    if (!brand) return res.status(404).json({ success: false, message: "Brand not found" });

    // Delete logo/cover files if exist
    if (brand.logo) fs.unlinkSync(path.join("uploads/brands", brand.logo));
    if (brand.coverImage) fs.unlinkSync(path.join("uploads/brands", brand.coverImage));

    return res.status(200).json({ success: true, message: "Brand permanently deleted" });
  } catch (err) {
    console.error("❌ Error permanently deleting Brand:", err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* -------------------------------------------------------------------------- */
/*                                 EXPORTS                                    */
/* -------------------------------------------------------------------------- */

module.exports = {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  softDeleteBrand,
  restoreBrand,
  deleteBrandPermanently,
};
