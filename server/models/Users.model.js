const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema


const userschema = new mongoose.Schema({
    username: {
        type: String,
        require: [true, 'required username'],
        trim: true,
        minlength: 3,
        maxlength: 100,
    },
    email: {
        type: String,
        maxlength: 100,
        minlength: 10,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        trim: true,
        require: [true, 'password required'],
        maxlength: 200,
        minlength: 3,
    },
    deliveryArea: {
        type: ObjectId,
        ref: 'DeliveryArea',
        required: true
    },
    address: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 150,
    },
    phone: {
        type: String,
        unique: true,
        require: [true, 'phone required'],
        trim: true,
        length: 11,
    },
    isVarified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true,
        require: [true, 'isActive required'],
    }
},
    { timestamps: true }
);

const Usermodel = mongoose.model('User', userschema);

module.exports = Usermodel;

