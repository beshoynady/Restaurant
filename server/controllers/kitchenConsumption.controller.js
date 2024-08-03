const KitchenConsumptionModel = require('../models/KitchenConsumption,model');

// Get all kitchen consumptions
const getAllKitchenConsumptions = async (req, res) => {
  try {
    const kitchenConsumptions = await KitchenConsumptionModel.find({})
      .populate('stockItemId')
      .populate('createdBy', '_id fullname username role');
    res.status(200).json({ success: true, data: kitchenConsumptions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get single kitchen consumption by ID
const getKitchenConsumptionById = async (req, res) => {
  const { id } = await req.params;
  try {
    const kitchenConsumption = await KitchenConsumptionModel.findById(id)
      .populate('stockItemId').populate('createdBy', '_id fullname username role');
    if (!kitchenConsumption) {
      return res.status(404).json({ success: false, error: 'Kitchen consumption not found' });
    }
    res.status(200).json({ success: true, data: kitchenConsumption });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Create a new kitchen consumption
const createKitchenConsumption = async (req, res) => {
  try {
    const { stockItemId, stockItemName, quantityTransferredToKitchen, bookBalance, unit, createdBy } = req.body;
    const newKitchenConsumption = await KitchenConsumptionModel.create({
      stockItemId,
      stockItemName,
      quantityTransferredToKitchen,
      bookBalance,
      unit,
      createdBy
    });
    res.status(201).json({ newKitchenConsumption });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Update kitchen consumption by ID
const updateKitchenConsumptionById = async (req, res) => {
  const { id } = req.params;
  const { stockItemId, stockItemName, quantityTransferredToKitchen, consumptionQuantity, unit, bookBalance, actualBalance, adjustment, productsProduced, createdBy } = req.body;

  try {
    const updatedKitchenConsumption = await KitchenConsumptionModel.findByIdAndUpdate(
      id,
      {
        stockItemId,
        stockItemName,
        quantityTransferredToKitchen,
        consumptionQuantity,
        unit,
        bookBalance,
        actualBalance,
        adjustment,
        productsProduced,
        createdBy
      },
      { new: true }
    );
    if (!updatedKitchenConsumption) {
      return res.status(404).json({ success: false, error: 'Kitchen consumption not found' });
    }
    res.status(200).json({ updatedKitchenConsumption });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete kitchen consumption by ID
const deleteKitchenConsumptionById = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedKitchenConsumption = await KitchenConsumptionModel.findByIdAndDelete(id);
    if (!deletedKitchenConsumption) {
      return res.status(404).json({ success: false, error: 'Kitchen consumption not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = {
  getAllKitchenConsumptions,
  getKitchenConsumptionById,
  createKitchenConsumption,
  updateKitchenConsumptionById,
  deleteKitchenConsumptionById,
};
