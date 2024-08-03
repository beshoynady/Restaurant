const CategoryStockmodel = require('../models/CategoryStock.model');


const CreateCategoryStock = async (req, res, next) => {
    try {
        const categoryStockname = await req.body.name;
        const existingCategory = await CategoryStockmodel.findOne({ name: categoryStockname });
        if (existingCategory) {
            return res.status(400).json({ error: "Category name already exists" });
        }
        const CreateCategoryStock = await CategoryStockmodel.create({ name: categoryStockname });
        CreateCategoryStock.save();
        res.status(201).json(CreateCategoryStock)
    }
    catch (error) {
        res.status(400).json(error);
        next(error);
    }
};

const getallcategoryStock = async (req, res) => {
    try {
        const allcategoryStock = await CategoryStockmodel.find({})
        res.status(200).json(allcategoryStock)
    }
    catch (error) {
        res.status(400).json(error);
    }
}

const getonecategoryStock = async (req, res) => {
    const categoryStockId = req.query.categoryStockId
    try {
        const categoryStock = await CategoryStockmodel.findById(categoryStockId)
        res.status(200).json(categoryStock)
    } catch (error) {
        res.status(404).json(error);
    }
}

const updatecategoryStock = async (req, res) => {
    try {
        const { categoryStockId } = await req.params;
        const newcategoryStockname = await req.body.name;

        const categoryStock = await CategoryStockmodel.findByIdAndUpdate({ _id: categoryStockId }, { name: newcategoryStockname }, { new: true })
        res.status(200).json(categoryStock);
    } catch (error) {
        res.status(404).json(error);
    }
}

const deleteCategoryStock = async (req, res) => {
    try {
        const { categoryStockId } = await req.params;
        const categoryStockdeleted = await CategoryStockmodel.findByIdAndDelete(categoryStockId);
        res.status(200).json(categoryStockdeleted);
    } catch (error) {
        res.status(404).json(error);
    }
}


module.exports = {
    CreateCategoryStock,
    getallcategoryStock,
    getonecategoryStock,
    updatecategoryStock,
    deleteCategoryStock
}