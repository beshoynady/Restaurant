const QRCode = require('qrcode');
const TableModel = require('../models/Table.model');


const createTable = async (req, res) => {
    const { tableNumber, description, chairs, sectionNumber } = req.body;

    try {
        // Create a new table document in the database
        const tableCreated = await TableModel.create({ tableNumber, description, chairs, sectionNumber });
        return res.status(200).json({ message: "Table created successfully", data: tableCreated });
    } catch (err) {
        // Handle and return error
        return res.status(400).json({ message: "Error creating table", err });
    }
};


const createQR = async (req, res) => {
    const { URL } = req.body;

    try {
        // Generate QR code as a data URL
        const QR = await QRCode.toDataURL(URL);
        return res.status(200).json({ QRCode: QR });
    } catch (err) {
        // Handle and return error
        return res.status(400).json({ message: "Error generating QR code", err });
    }
};


const showAllTables = async (_req, res) => {
    try {
        // Find all table documents in the database
        const allTables = await TableModel.find();
        return res.status(200).json(allTables);
    } catch (error) {
        // Handle and return error
        console.error("Error fetching all tables:", error);
        return res.status(400).json({ message: "Error fetching tables", error });
    }
};


const showOneTable = async (req, res) => {
    const id = req.params.tableid;

    try {
        // Find a table document by ID
        const oneTable = await TableModel.findById(id);
        if (!oneTable) return res.status(404).json({ message: "Table does not exist" });
        return res.status(200).json(oneTable);
    } catch (err) {
        // Handle and return error
        console.error("Error fetching table:", err);
        return res.status(500).json({ message: "Internal Server Error", err });
    }
};


const updateTable = async (req, res) => {
    const id = req.params.tableid;
    const { tableNumber, description, chairs, sectionNumber, isValid } = req.body;

    try {
        // Find and update the table document by ID
        const updatedTable = await TableModel.findByIdAndUpdate(
            { _id: id },
            { $set: { tableNumber, description, chairs, sectionNumber, isValid } },
            { new: true }
        ).exec();

        if (!updatedTable) {
            return res.status(404).json({ message: "Table not found" });
        } else {
            return res.status(200).json(updatedTable);
        }
    } catch (err) {
        // Handle and return error
        console.error("Invalid request body:", err);
        return res.status(400).json({ message: 'Invalid request body', err });
    }
};


const deleteTable = async (req, res) => {
    const id = req.params.tableid;

    try {
        // Find and delete the table document by ID
        const deletedTable = await TableModel.findByIdAndDelete(id).exec();
        if (deletedTable) {
            return res.status(200).json({ message: "Table deleted successfully" });
        } else {
            return res.status(404).json({ message: "Table not found or already deleted" });
        }
    } catch (error) {
        // Handle and return error
        console.error("Error deleting table:", error);
        return res.status(500).json({ message: "Server Error: Unable to process your request at this time", error });
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
