const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define the schema for the Table model
const TableSchema = new Schema(
    {
        // Table number
        tableNumber: {
            type: Number,
            required: true,
            unique: true,
            trim: true,
            min: 1,
            max: 100000,
            validate: {
                validator: function (v) {
                    return v > 0;
                },
                message: '{VALUE} is not a valid table number'
            }
        },
        // Description of the table
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
            maxlength: 100,
        },
        // Number of chairs at the table
        chairs: {
            type: Number,
            required: true,
            min: 1,
            max: 20,
            default: 1,
            validate: {
                validator: function (v) {
                    return v > 0;
                },
                message: '{VALUE} is not a valid number of chairs'
            }
        },
        // Whether the table is valid or not
        isValid: {
            type: Boolean,
            default: true,
            required: true
        },
        // Section number where the table is located
        sectionNumber: {
            type: Number,
            required: true,
            min: 1,
            max: 100,
        },
        // Creation date of the table
        createdAt: {
            type: Date,
            default: Date.now,
            required: true,
        },
        // Last update date of the table
        updatedAt: {
            type: Date,
            default: Date.now,
        }
    },
    {
        timestamps: true,
    }
);

// Define the Table model
const TableModel = mongoose.model('Table', TableSchema);

// Export the Table model
module.exports = TableModel;
