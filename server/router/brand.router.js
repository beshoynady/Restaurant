const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  softDeleteBrand,
  restoreBrand,
  deleteBrandPermanently,
} = require("../controllers/brand.controller");

const { authenticateToken } = require("../middlewares/authenticate");
const checkSubscription = require("../middlewares/checkSubscription");
const BrandModel = require("../models/brand.model");

// ======================================
//  📁 Images Directory
// ======================================
const imagesDir = path.join(__dirname, "..", "uploads", "restaurants");

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// ======================================
// ⚙️  Multer Configuration
// ======================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 }, // 1 MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, JPG, and PNG formats are allowed"));
    }
    cb(null, true);
  },
});

// ======================================
// 🧹 middleware to delete old images on update
// ======================================
const deleteOldImagesMiddleware = async (req, res, next) => {
  try {
    const restaurantId = req.params.id;

    if (!restaurantId) {
      return res.status(400).json({ message: "Brand ID is missing" });
    }

    const restaurant = await BrandModel.findById(restaurantId);

    if (!restaurant) {
      return res
        .status(404)
        .json({ message: "Brand not found to delete old images" });
    }

    // Delete old images only if new ones are uploaded
    if (req.files?.logo?.[0] && restaurant.logo) {
      const oldLogoPath = path.join(imagesDir, restaurant.logo);
      if (fs.existsSync(oldLogoPath)) fs.unlinkSync(oldLogoPath);
    }

    if (req.files?.coverImage?.[0] && restaurant.coverImage) {
      const oldCoverPath = path.join(imagesDir, restaurant.coverImage);
      if (fs.existsSync(oldCoverPath)) fs.unlinkSync(oldCoverPath);
    }

    next();
  } catch (err) {
    console.error("Error deleting old images:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ======================================
// 🚀 routes
// ======================================

// 🔹 Update Subscription Dates
// router.put(
//   "/update-subscription/:id",
//   authenticateToken,
//   updateSubscriptionDates
// );

//create brand
router.post(
  "/",
  authenticateToken,
  checkSubscription,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  createBrand
);
//get all brands
router.get("/", authenticateToken, checkSubscription, getAllBrands);

router
  .route("/:id")
  .get(authenticateToken, checkSubscription, getBrandById)
  .put(
    authenticateToken,
    checkSubscription,
    upload.fields([
      { name: "logo", maxCount: 1 },
      { name: "coverImage", maxCount: 1 },
    ]),
    deleteOldImagesMiddleware,
    updateBrand
  );

router
  .route("/soft-delete/:id")
  .put(authenticateToken, checkSubscription, softDeleteBrand);

router
  .route("/restore/:id")
  .put(authenticateToken, restoreBrand);

router
  .route("/permanent-delete/:id")
  .delete(authenticateToken, deleteBrandPermanently);

module.exports = router;
