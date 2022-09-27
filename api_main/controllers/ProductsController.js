const Product = require('../model/Product');

const createProduct= async (req, res) => {
    const newProduct=new Product(req.body);
    try{
        const saveProduct=await newProduct.save();
        res.status(200).json({ 'success': `New Product ${saveProduct.title} created!` });
    }catch(err){
        res.status(500).json(err);
    }
    
}
module.exports = {
    createProduct,
}