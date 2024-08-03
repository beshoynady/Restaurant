const QRCode = require('qrcode');
const TableModel = require('../models/Table.model');

// Create a new table
const createTable = async (req, res) => {
    const { tableNumber, description, chairs, sectionNumber } = req.body;

    try {
        const tableCreated = await TableModel.create({ tableNumber, description, chairs, sectionNumber });
        return res.status(200).json({ message: "Table created successfully", data: tableCreated });
    } catch (err) {
        return res.status(400).json(err.message);
    }
};

// Create QR code from URL
const createQR = async (req, res) => {
    const { URL } = req.body;

    try {
        const QR = await QRCode.toDataURL(URL);
        return res.status(200).json(QR);
    } catch (err) {
        return res.status(400).json(err);
    }
};

// Retrieve all tables
const showAllTables = async (_req, res) => {
    try {
        const allTables = await TableModel.find();
        return res.status(200).json(allTables);
    } catch (error) {
        console.error("Error fetching all tables:", error);
        return res.status(400).json(error);
    }
};

// Retrieve a single table by ID
const showOneTable = async (req, res) => {
    const id = req.params.tableid;

    try {
        const oneTable = await TableModel.findById(id);
        if (!oneTable) return res.status(404).json({ message: "Table does not exist" });
        return res.status(200).json(oneTable);
    } catch (e) {
        console.error("Error fetching table:", e);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Update a table by ID
const updateTable = async (req, res) => {
    const id = req.params.tableid;
    const { tableNumber, description, chairs, sectionNumber, isValid } = req.body;

    try {
        const updatedTable = await TableModel.findByIdAndUpdate(
            { _id: id },
            { $set: { tableNumber, description, chairs, sectionNumber, isValid } },
            { new: true }
        ).exec();

        if (!updatedTable) {
            return res.status(404).json({ message: "Table not found" });
        } else {
            return res.status(201).json(updatedTable);
        }
    } catch (err) {
        console.error("Invalid request body:", err);
        return res.status(400).json({ message: 'Invalid request body' });
    }
};

// Delete a table by ID
const deleteTable = async (req, res) => {
    const id = req.params.tableid;

    try {
        const deletedTable = await TableModel.findByIdAndDelete(id).exec();
        if (deletedTable) {
            return res.status(200).json({ message: "Table deleted successfully" });
        } else {
            return res.status(404).json({ message: "Table not found or already deleted" });
        }
    } catch (error) {
        console.error("Error deleting table:", error);
        return res.status(500).json({ message: "Server Error: Unable to process your request at this time" });
    }
};

module.exports = {
    createTable,
    createQR,
    showAllTables,
    showOneTable,
    updateTable,
    deleteTable
};
