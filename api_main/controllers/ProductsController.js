const Product = require('../model/Product');
const User = require('../model/User');
const Behavior =require("../model/Behavior");


const createProduct= async (req, res) => {
    const newProduct=new Product(req.body);
    try{
        const saveProduct=await newProduct.save();
        res.status(200).json({ 'success': `New Product ${saveProduct.title} created!`,'message':true });
    }catch(err){
        res.status(500).json(err);
    } 
}


const getProductHomePage=async(req,res)=>{
    try{
        const date=new Date()
        const lastDate=new Date(date.setDate(date.getDate()-7));
        const newProduct=await Product.find({status:"sale"}).sort({updatedAt:-1}).limit(12);
        const bestProduct=await Product.find({status:"sale"}).sort({sold:-1}).limit(12);
        const topProduct= await Behavior.aggregate([
            {$unwind: '$actions'},
            { $match: { 
                "actions.date": { $gte: lastDate } 
                 } 
            },
            {$group: 
                {
                    _id: '$actions.find',                   
                    total: {$sum: 1}
                }
            },
            {
                $sort:{
                    total:-1
                }
            },
            {
                $limit:12
            }
        ])
        
        res.json({"data":{
            new:newProduct,
            best:bestProduct,
            trending:topProduct
        },'message':true});

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
    let key=req.query.key;
    try{
        let products;
        if(key==="sale"){
            products=await User.aggregate([
                    { $addFields: { "vendorId": { $toString: "$_id" }}},
                    {
                        $lookup:
                        {
                            from: "products",
                            localField: "vendorId",
                            foreignField: "userId",
                            as: "productInfo"
                        }
                    },
                    {$unwind: '$productInfo'},
                    { $match: { 
                        "productInfo.status":"sale"
                        }
                    },
                    {
                        $project:{
                            "name":"$name",
                            "img":"$productInfo.img",
                            "price":"$productInfo.price",
                            "userId":"$productInfo.userId",
                            "title":"$productInfo.title",
                            "category":"$productInfo.category",
                            "status":"$productInfo.status", 
                            "_id":"$productInfo._id",
                            "stock":"$productInfo.stock",
                        }
                    },
                    
            ])
         return   res.status(200).json(products)
        }

        products=await User.aggregate([
            
            { $addFields: { "userId": { $toString: "$_id" }}},
            {
                $lookup:
                {
                    from: "products",
                    localField: "userId",
                    foreignField: "userId",
                    as: "productInfo"
                }
            },
            {$unwind: '$productInfo'},
            {
                $project:{
                    "name":"$name",
                    "img":"$productInfo.img",
                    "price":"$productInfo.price",
                    "userId":"$productInfo.userId",
                    "title":"$productInfo.title",
                    "category":"$productInfo.category",
                    "status":"$productInfo.status", 
                    "_id":"$productInfo._id",
                    "stock":"$productInfo.stock",
                }
            },
            
         ])
        
        return res.status(200).json(products)
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
    if(req.body.sold){
        req.body.sold=Number(product.sold)+Number(req.body.sold);
    }
    const user=await User.findById(req.body.userIdChange);
    if(req.body.userIdChange==product.userId||user.roles?.Admin){
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


module.exports = {
    createProduct,
    getProduct,
    getProductById,
    updateProduct,
    deleteProducts,
    getAllProductByVendorId,
    addComment,
    getProductHomePage,

}