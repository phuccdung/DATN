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

const getProduct=async(req,res)=>{
    const qWaiting=req.query.waiting;
    try{
        let products;
        if(qWaiting){
            products=await Product.find({"status":"waiting"}).sort({createdAt:1}).limit(5)
        }else{
            products=await Product.find().sort({updatedAt:-1})   
        }
     res.status(200).json(products)
    }catch(err){
        res.status(500).json(err);
    }
}
module.exports = {
    createProduct,
    getProduct,
}