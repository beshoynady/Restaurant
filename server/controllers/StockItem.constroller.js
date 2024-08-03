const StockItemsModel = require('../models/StockItems.model');

// Create a new stock item
const createStockItem = async (req, res) => {
  try {
    const {
      itemName, categoryId, largeUnit, smallUnit, currentBalance, price, totalCost, parts,
      costOfPart, minThreshold, createdBy, createdAt,
    } = req.body;
    const existingItem = await StockItemsModel.findOne({ itemName });
    if (existingItem) {
      return res.status(400).json({ error: "Item name already exists" });
    }
    const newStockItem = await StockItemsModel.create({
      itemName, categoryId, largeUnit, smallUnit, currentBalance, price, totalCost, parts,
       costOfPart, minThreshold, createdBy, createdAt,
    });

    res.status(200).json(newStockItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all stock items
const getAllStockItems = async (req, res) => {
  try {
    const allItems = await StockItemsModel.find({}).populate('createdBy').populate('categoryId');
    res.status(200).json(allItems);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get one stock item by ID
const getOneItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const oneItem = await StockItemsModel.findById(itemId);
    if (!oneItem) {
      return res.status(404).json({ error: 'Item not found' });
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
      { _id: itemId },
      updatedData,
      { new: true }
    );

    if (!updatedStockItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json(updatedStockItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update stock movements by ID
const movements = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { currentBalance, price, costOfPart } = req.body;

    const movedStockItem = await StockItemsModel.findByIdAndUpdate(
      { _id: itemId },
      { currentBalance, price, costOfPart },
      { new: true }
    );
    if (!movedStockItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(movedStockItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a stock item by ID
const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const itemDelete = await StockItemsModel.findByIdAndDelete(itemId);

    if (!itemDelete) {
      return res.status(404).json({ error: 'Item not found' });
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
  movements,
  deleteItem,
};
