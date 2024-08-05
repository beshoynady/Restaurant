const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require('fs');

const router = express.Router();

// const verifyJWT = require('../middleware/verifyjwt');
const authenticateToken = require('../utlits/authenticate')
const checkSubscription = require('../utlits/checkSubscription')

const {
  createProduct,
  getAllProducts,
  getProductByCategory,
  getOneProduct,
  updateProduct,
  updateProductWithoutImage,
  deleteProduct
} = require("../controllers/product.controller");



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = new Date().toISOString().replace(/:/g, "-");
    cb(null, uniqueSuffix + file.originalname);
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 ,
  },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, JPG, and PNG file types are allowed."));
    }
  },
});





// Function to delete the old image
// const deleteOldImage = (imagePath) => {
//   try {
//     fs.unlinkSync(imagePath); // Deleting the image using fs.unlinkSync
//     console.log('Old image deleted successfully');
//   } catch (err) {
//     console.error('Error deleting old image', err);
//   }
// };

// // Middleware to delete the old image before uploading the new one
// const deleteOldImageMiddleware = async (req, res, next) => {
//   try {
//     const productId = req.params.productid;
//     if (!productId) {
//       return res.status(400).json({ message: 'Product ID is missing' });
//     }

//     const product = await getOneProduct();
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     if (!product.image) {
//       return res.status(400).json({ message: 'Product image not found' });
//     }

//     const oldImagePath = path.join(__dirname, '..', 'images', product.image);
//     if (fs.existsSync(oldImagePath)) {
//       fs.unlinkSync(oldImagePath); 
//       console.log('Old image deleted successfully');
//       return res.status(200).json({ message: 'Old image deleted successfully' });
//     } else {
//       return res.status(404).json({ message: 'Old image not found' });
//     }
//   } catch (err) {
//     console.error('Error deleting old image', err);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };


// router.use(verifyJWT)

router.route('/')
  .post(authenticateToken, checkSubscription, upload.single("image"), createProduct)
  // .post(authenticateToken, checkSubscription, createProduct)
  .get(getAllProducts);

router.route('/getproductbycategory/:categoryid').get(getProductByCategory)
router.route('/:productid')
.get(getOneProduct).put(authenticateToken, checkSubscription, upload.single("image"), updateProduct)
.delete(deleteProduct);
router.route('/withoutimage/:productid').put(authenticateToken, checkSubscription, updateProductWithoutImage)

module.exports = router;
