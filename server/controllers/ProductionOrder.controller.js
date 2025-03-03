const ProductionOrderModel = require('../models/ProductionOrder.model');

const createProductionOrder = async (req, res) => {
  try {
    const {
        storeId,
        preparationSection,
        stockItem,
        quantityRequested,
        note,
    } = req.body;
    const createdBy = req.employee.id;
    if (!storeId || !preparationSection || !stockItem || !quantityRequested || !createdBy) {
      return res.status(400).send({ error: 'All fields are required to create a production order' });
    }
    const productionOrder = await ProductionOrderModel.create(req.body);

    res.status(201).send(productionOrder);
  } catch (error) {

    res.status(400).send(error);
  }
}

const getProductionOrdersByStore = async (req, res) => {
    try {
        const { storeId } = req.params;
        const productionOrders = await ProductionOrderModel.find({ storeId });
        if (!productionOrders) {
        return res.status(404).send({ error: 'No production orders found' });
        }
        if (productionOrders.length === 0) {
        return res.status(404).send({ error: 'No production orders found' });
        }
        res.status(200).send(productionOrders);
    } catch (error) {
    
        res.status(400).send(error);
    }
}

const getProductionOrdersByPreparationSection = async (req, res) => {
    try {
        const { preparationSection } = req.params;
        const productionOrders = await ProductionOrderModel.find({ preparationSection });
        if (!productionOrders) {
        return res.status(404).send({ error: 'No production orders found' });
        }
        if (productionOrders.length === 0) {
        return res.status(404).send({ error: 'No production orders found' });
        }
        res.status(200).send(productionOrders);
    } catch (error) {
    
        res.status(400).send(error);
    }
}


const getProductionOrders = async (req, res) => {
  try {
    const productionOrders = await ProductionOrderModel.find();
    if (!productionOrders) {
      return res.status(404).send({ error: 'No production orders found' });
    }
    if (productionOrders.length === 0) {
      return res.status(404).send({ error: 'No production orders found' });
    }
    res.status(200).send(productionOrders);
  } catch (error) {

    res.status(400).send(error);
  }
}



const getProductionOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const productionOrder = await ProductionOrderModel.findById(id);
        if (!productionOrder) {
            return res.status(404).send({ error: 'Production order not found' });
        }
        res.status(200).send(productionOrder);
    
    } catch (error) {
        res.status(400).send(error);
        
    }
}

const updateProductionOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { storeId, preparationSection, stockItem, quantityRequested, note } = req.body;
        const updatedBy = req.employee.id;
        if (!storeId || !preparationSection || !stockItem || !quantityRequested || !updatedBy) {
            return res.status(400).send({ error: 'All fields are required to update a production order' });
        }
        const findProductionOrder = await ProductionOrderModel.findById(id);
        if (!findProductionOrder) {
            return res.status(404).send({ error: 'Production order not found' });
        }
        if (findProductionOrder.productionStatus !== 'Pending') {
            return res.status(400).send({ error: 'Production order cannot be updated' });
        }

        const productionOrder = await ProductionOrderModel.findByIdAndUpdate(id, {
            $set: {
                storeId,
                preparationSection,
                stockItem,
                quantityRequested,
                note,
                updatedBy,
            }
        }, { new: true });
        if (!productionOrder) {
            return res.status(404).send({ error: 'Production order not found' });
        }

        res.status(200).send(productionOrder);
    
    } catch (error) {
        res.status(400).send(error);
        
    }
}

const updateProductionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { productionStatus } = req.body;
        const updatedBy = req.employee.id;
        if (!productionStatus || !updatedBy) {
            return res.status(400).send({ error: 'Production status and updated by are required' });
        }
        const findProductionOrder = await ProductionOrderModel.findById(id);
        if (!findProductionOrder) {
            return res.status(404).send({ error: 'Production order not found' });
        }
        if (findProductionOrder.productionStatus === 'Completed' || findProductionOrder.productionStatus === 'Canceled' || findProductionOrder.productionStatus === 'Rejected') {
            return res.status(400).send({ error: 'Production order cannot be updated' });
        }

        const productionOrder = await ProductionOrderModel.findByIdAndUpdate(id, {
            $set: {
                productionStatus,
                updatedBy,
            }
        }, { new: true });
        if (!productionOrder) {
            return res.status(404).send({ error: 'Production order not found' });
        }

        res.status(200).send(productionOrder);
    
    } catch (error) {
        res.status(400).send(error);
        
    }
}



const deleteProductionOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const productionOrder = await ProductionOrderModel.findById(id);
        if (!productionOrder) {
            return res.status(404).send({ error: 'Production order not found' });
        }
        if (productionOrder.productionStatus !== 'Pending') {
            return res.status(400).send({ error: 'Production order cannot be deleted' });
        }
        await ProductionOrderModel.findByIdAndDelete(id);
        res.status(200).send({ message: 'Production order deleted successfully' });
    
    } catch (error) {
        res.status(400).send(error);
        
    }
}


module.exports = {
  createProductionOrder,
  getProductionOrdersByStore,
  getProductionOrdersByPreparationSection,
  getProductionOrders,
  getProductionOrder,
  updateProductionOrder,
  updateProductionStatus,
  deleteProductionOrder,
}
