const Product = require('../model/Product');
const User = require('../model/User');

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

const deleteProducts=async (req,res)=>{
    try {
        const product= await Product.findById(req.params.id);
        if(!product){
            res.status(200).json({"messege":false});
        }
        const user=await User.findById(req.body.userId);
        if(!user){
            res.status(500).json({"messege":false});
        }
        if(req.body.userId==product.userId||user.roles?.Admin){
            await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ "success": "Product has been deleted...",'message':true});
        }
      } catch (err) {
        res.status(500).json(err);
      }
}
module.exports = {
    createProduct,
    getProduct,
    deleteProducts,
}