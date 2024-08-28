const StockItemsModel = require("../models/StockItems.model");

// Create a new stock item
const createStockItem = async (req, res) => {
  try {
    const {
      itemCode,
      itemName,
      categoryId,
      // storeId,
      largeUnit,
      parts,
      smallUnit,
      minThreshold,
      costMethod,
      suppliers,
      isActive,
      notes,
    } = req.body;
    const createdBy = req.employee.id;

    // Check for unique itemCode
    const existingItem = await StockItemsModel.findOne({ itemCode });
    if (existingItem) {
      return res.status(400).json({ error: "Item itemCode already exists" });
    }

    // Create new stock item
    const newStockItem = await StockItemsModel.create({
      itemCode,
      itemName,
      categoryId,
      // storeId,
      largeUnit,
      parts,
      smallUnit,
      minThreshold,
      costMethod,
      suppliers,
      isActive,
      createdBy,
      notes,
    });

    res.status(201).json(newStockItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all stock items
const getAllStockItems = async (req, res) => {
  try {
    const allItems = await StockItemsModel.find({})
      .populate("categoryId")
      // .populate("storeId")
      .populate("createdBy")
      .populate("suppliers");
    res.status(200).json(allItems);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get one stock item by ID
const getOneItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const oneItem = await StockItemsModel.findById(itemId)
      .populate("categoryId")
      // .populate("storeId")
      .populate("createdBy")
      .populate("suppliers");
    if (!oneItem) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.status(200).json(oneItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a stock item by ID
const updateStockItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const updatedData = req.body;

    const updatedStockItem = await StockItemsModel.findByIdAndUpdate(
      itemId,
      updatedData,
      { new: true }
    );

    if (!updatedStockItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json(updatedStockItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a stock item by ID
const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const itemDelete = await StockItemsModel.findByIdAndDelete(itemId);

    if (!itemDelete) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.status(200).json(itemDelete);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createStockItem,
  getAllStockItems,
  getOneItem,
  updateStockItem,
  deleteItem,
};
