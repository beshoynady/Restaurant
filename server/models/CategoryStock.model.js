const mongoose= require('mongoose');

const categoryStockSchema = new mongoose.Schema({
    name :{
        type : String,
        required : [true, 'required'],
        unique : [true, 'unique'],
        trim : true,
        maxlength : 50,
        minlength : 3,
    },
},
{timestamps : true}
)


const CategoryStockmodel = mongoose.model('CategoryStock', categoryStockSchema)

module.exports = CategoryStockmodel