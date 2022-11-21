const Product = require('../model/Product');
const User = require('../model/User');
const CryptoJS=require("crypto-js");

const createProduct= async (req, res) => {
    const newProduct=new Product(req.body);
    try{
        const saveProduct=await newProduct.save();
        res.status(200).json({ 'success': `New Product ${saveProduct.title} created!`,'message':true });
    }catch(err){
        res.status(500).json(err);
    } 
}

const getAllProductByVendorId=async(req,res)=>{
    const qStatus=req.query?.status;
    const qCategory=req.query?.category;
    const qKey=req.query?.key;
    if (!req?.params?.id) return res.status(400).json({ "message": false });
    try{
        let products;
        if(qKey){
            products=await Product.find({ 
                title: {$regex: qKey, $options: 'i'},
                userId:req.params.id,
             } );
        }else{
            if(qCategory&&qStatus){
                products=await Product.find({
                    userId:req.params.id,
                    status:qStatus,
                    category:qCategory
                });
            }else{
                if(qCategory){
                    products=await Product.find({
                        userId:req.params.id,
                        category:qCategory
                    });
                }else{
                    if(qStatus){
                        products=await Product.find({
                            userId:req.params.id,
                            status:qStatus,
                        });  
                    }
                    else{
                        products=await Product.find({
                            userId:req.params.id,
                        }); 
                    }
                }
            }
        }
        
        res.json({"data":products,'message':true});
    }catch(err){
        res.status(500).json(err);
    }
}

const getProduct=async(req,res)=>{
    const key=req.query.key;
    try{
        let products;
        if(key){
            products=await Product.find({ $or: [ { category: {'$regex': key} }, { title: {$regex: key, $options: 'i'}  } ] });
        }else{
            products=await Product.find().sort({updatedAt:-1})   
        }
     res.status(200).json(products)
    }catch(err){
        res.status(500).json(err);
    }
}

const getProductById = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": false });
    const product = await Product.findOne({ _id: req.params.id }).exec();
    if (!product) {
        return res.status(204).json({ 'message': false });
    }
    const limit=req.query.limit;
    if(limit){
        otherProducts=await Product.find({category:product.category}).limit(limit); 
        res.json({"data":product,"otherProducts":otherProducts,'message':true});
    }else{
        res.json({"data":product,'message':true});
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

const updateProduct = async (req, res) => {
    try{
        if (!req?.params?.id) return res.status(400).json({ "success": 'Product ID required','message':false} );
    const product = await Product.findOne({ _id: req.params.id }).exec();
    if (!product) {
        return res.status(204).json({ 'message': `Product ID ${req.params.id} not found` ,'message':false});
    }
    const user=await User.findById(req.body.userId);
    if(req.body.userId==product.userId||user.roles?.Admin){
      const updateProduct=  await Product.findByIdAndUpdate(
            req.params.id,
            {
              $set: req.body,
            },
            { new: true }
          );

    res.status(200).json({ "data":updateProduct,'message':true});
    }
    }catch (err) {
        res.status(500).json(err);
    }
    
}

const addComment=async(req,res)=>{
    if (!req?.params?.id) return res.status(400).json({ "message": false });
    const product = await Product.findOne({ _id: req.params.id }).exec();
    if (!product) {
        return res.status(204).json({ 'message': false });
    }
    let rating={
        "total":product.ratings.total+req.body.start,
        "count":product.ratings.count+1
    }
    // res.json({"data":rating});
    try{
        const result= await Product.findByIdAndUpdate(
                {_id:req.params.id},
                {
                    $push:{comment:req.body},
                    $set:{
                        ratings:rating
                    }
                },
            );
        res.json({"data":result,'message':true});
    }catch(err){
        res.status(500).json({ 'data': err.message , "message": false});
    }
}

const createLink = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": false });
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': false });
    }
    const key=CryptoJS.AES.encrypt(
        req.params.id,
        process.env.PASS_SEC)
        .toString();    
    res.json({"data":key,'message':true});
    
}

module.exports = {
    createProduct,
    getProduct,
    getProductById,
    updateProduct,
    deleteProducts,
    getAllProductByVendorId,
    addComment,
    createLink,
}