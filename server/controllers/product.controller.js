const path = require("path");
const fs = require('fs');
const ProductModel = require('../models/Product.model.js');

/**
 * Create a new product
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const createProduct = async (req, res) => {
  try {
    const {
      productname,
      productprice,
      productdescription,
      productcategoryid,
      available,
      hasSizes,
      sizes,
      hasExtras,
      isAddon,
      extras
    } = req.body;

    // Retrieve the filename of the uploaded image
    const image = req.file ? req.file.filename : null;

    // Validate required fields
    if (!productname || !productcategoryid) {
      return res.status(400).json({ error: 'Product name and category are required' });
    }

    // Validate 'sizes' array
    if (hasSizes && (!Array.isArray(sizes) || sizes.length === 0)) {
      return res.status(400).json({ error: 'Invalid sizes provided' });
    }

    // Validate 'extras' array
    if (hasExtras && (!Array.isArray(extras) || extras.length === 0)) {
      return res.status(400).json({ error: 'Invalid extras provided' });
    }

    // Create the product
    const newProduct = await ProductModel.create({
      name: productname,
      description: productdescription,
      price: productprice,
      category: productcategoryid,
      available,
      hasSizes,
      sizes,
      hasExtras,
      isAddon,
      extras,
      image
    });

    res.status(201).json(newProduct); // 201 Created
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Retrieve all products
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getAllProducts = async (req, res) => {
  try {
    // Retrieve and populate related fields
    const allProducts = await ProductModel.find({})
      .populate('category')
      .populate('sizes.sizeRecipe')
      .populate('productRecipe')
      .populate('extras');

    if (allProducts.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json(allProducts); // 200 OK
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Retrieve products by category
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getProductByCategory = async (req, res) => {
  try {
    const { categoryid } = req.params;
    const products = await ProductModel.find({ category: categoryid })
      .populate('category')
      .populate('sizes.sizeRecipe')
      .populate('productRecipe')
      .populate('extras');

    res.status(200).json(products); // 200 OK
  } catch (err) {
    console.error('Error fetching products by category:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Retrieve a single product by its ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const getOneProduct = async (req, res) => {
  try {
    const { productid } = req.params;
    const product = await ProductModel.findById(productid)
      .populate('category')
      .populate('productRecipe')
      .populate('extras');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product); // 200 OK
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update a product by its ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const updateProduct = async (req, res) => {
  try {
    const { productid } = req.params;
    const {
      productname,
      productdescription,
      productcategoryid,
      productprice,
      productdiscount,
      priceAfterDiscount,
      available,
      productRecipe,
      hasSizes,
      sizes,
      hasExtras,
      isAddon,
      extras
    } = req.body;

    // Validate 'sizes' array
    if (hasSizes && (!Array.isArray(sizes) || sizes.length === 0)) {
      return res.status(400).json({ error: 'Invalid sizes provided' });
    }

    // Validate 'extras' array
    if (hasExtras && (!Array.isArray(extras) || extras.length === 0)) {
      return res.status(400).json({ error: 'Invalid extras provided' });
    }

    // Handle new image upload
    if (req.file) {
      // Delete old image if it exists
      const product = await ProductModel.findById(productid);
      if (product && product.image) {
        const oldImagePath = path.join(__dirname, '..', 'images', product.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log('Old image deleted successfully');
        }
      }
    }

    // Update product details
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productid,
      {
        name: productname,
        description: productdescription,
        price: productprice,
        category: productcategoryid,
        discount: productdiscount,
        priceAfterDiscount,
        productRecipe,
        hasSizes,
        sizes,
        hasExtras,
        isAddon,
        extras,
        image: req.file ? req.file.filename : undefined,
        available
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct); // 200 OK
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Update a product by its ID without changing the image
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const updateProductWithoutImage = async (req, res) => {
  try {
    const { productid } = req.params;
    const {
      productname,
      productprice,
      productdescription,
      productcategoryid,
      productdiscount,
      priceAfterDiscount,
      productRecipe,
      available,
      hasSizes,
      sizes,
      hasExtras,
      isAddon,
      extras
    } = req.body;

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productid,
      {
        name: productname,
        description: productdescription,
        price: productprice,
        category: productcategoryid,
        discount: productdiscount,
        priceAfterDiscount,
        productRecipe,
        available,
        hasSizes,
        sizes,
        hasExtras,
        isAddon,
        extras
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct); // 200 OK
  } catch (error) {
    console.error('Error updating product without image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Delete a product by its ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const deleteProduct = async (req, res) => {
  try {
    const { productid } = req.params;
    const product = await ProductModel.findById(productid);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Optionally delete the image associated with the product
    if (product.image) {
      const imagePath = path.join(__dirname, '..', 'images', product.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log('Product image deleted successfully');
      }
    }

    await ProductModel.findByIdAndDelete(productid);
    res.status(200).json({ message: 'Product deleted successfully', deletedProduct: product }); // 200 OK
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductByCategory,
  getOneProduct,
  updateProduct,
  updateProductWithoutImage,
  deleteProduct
};
