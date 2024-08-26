const StoreModel = require("../models/Store.model"); // Adjust the path as needed

// Create a new store
const createStore = async (req, res, next) => {
  try {
    const {
      storeName,
      storeCode,
      description,
      address,
      storekeeper,
    } = req.body;
    const createdBy = req.employee.is
    // Check if a store with the same name already exists
    const existingStore = await StoreModel.findOne({ storeName });
    if (existingStore) {
      return res.status(400).json({ error: "Store name already exists" });
    }
    if (!storeName || !storeCode || !description || !address || !storekeeper) {
        return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
      }

    // Create a new store
    const newStore = await StoreModel.create({
      storeName,
      storeCode,
      description,
      address,
      storekeeper,
      createdBy,
    });
    // Send response
    res.status(201).json(newStore);
  } catch (error) {
    res.status(400).json(error);
    next(error);
  }
};

// Get all stores
const getAllStores = async (req, res) => {
  try {
    const stores = await StoreModel.find({})
      .populate("storekeeper")
      .populate("createdBy");
    res.status(200).json(stores);
  } catch (error) {
    res.status(400).json(error);
  }
};

// Get a single store by ID
const getStoreById = async (req, res) => {
  const { id } = req.params;
  try {
    const store = await StoreModel.findById(id)
      .populate("storekeeper")
      .populate("createdBy");
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }
    res.status(200).json(store);
  } catch (error) {
    res.status(404).json(error);
  }
};

// Update a store
const updateStore = async (req, res) => {
  const { id } = req.params;

  const { storeName,storeCode, description, address, storekeeper } = req.body;

  try {
    const updatedStore = await StoreModel.findByIdAndUpdate(
      id,
      { storeName, storeCode, description, address, storekeeper },
      { new: true, runValidators: true }
    )
      .populate("storekeeper")
      .populate("createdBy");
    if (!updatedStore) {
      return res.status(404).json({ error: "Store not found" });
    }
    res.status(200).json(updatedStore);
  } catch (error) {
    res.status(404).json(error);
  }
};

// Delete a store
const deleteStore = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedStore = await StoreModel.findByIdAndDelete(id);
    if (!deletedStore) {
      return res.status(404).json({ error: "Store not found" });
    }
    res.status(200).json({ message: "Store deleted successfully" });
  } catch (error) {
    res.status(404).json(error);
  }
};

module.exports = {
  createStore,
  getAllStores,
  getStoreById,
  updateStore,
  deleteStore,
};
