const Order = require('../model/Order');
const User = require('../model/User');

const createOrder= async (req, res) => {
    const newOrder=new Order(req.body);
    try{
        const saveOrder=await newOrder.save();
        res.status(200).json({ 'data':  saveOrder._id ,'message':true });
    }catch(err){
        res.status(500).json(err);
    } 
}
const getOrdertByUserId = async (req, res) => {
    const qStatus=req.query.status;
    if (!req?.params?.userId) return res.status(400).json({ "message": false });
    try{
        let order;
        if(qStatus){
            order = await Order.find({ userId: req.params.userId ,status: qStatus}).sort({createdAt:-1}).limit(20);
            res.json({"data":order,'message':true});
            
        }else{
            order = await Order.find({ userId: req.params.userId }).sort({createdAt:-1}).limit(20);
            res.json({"data":order,'message':true});
        }
    
    }catch(err){
        res.status(500).json(err);
    }
}

const getOrderByNameOrderItem=async (req, res) => {
    const qStatus=req.query.status;
    const qKey=req.query.key;
    if (!req?.params?.userId) return res.status(400).json({ "message": false });
    try{
        let order;
        if(qStatus){
            order = await Order.find({ 
                userId: req.params.userId ,
                status: qStatus,
                products: {$elemMatch: { productName: {$regex: qKey, $options: 'i'} }}
            }).sort({createdAt:-1}).limit(20);
            res.json({"data":order,'message':true});
            
        }else{
            order = await Order.find({ 
                userId: req.params.userId ,
                products: {$elemMatch: { productName: {$regex: qKey, $options: 'i'} }}
            }).sort({createdAt:-1}).limit(20);
            res.json({"data":order,'message':true});
        }
        
        // res.json({"data":qKey,'message':true});
    }catch(err){
        res.status(500).json(err);
    }
}

const getOrderWithDate=async (req,res)=>{
    const fromDate=new Date(req.query.fromDate) ;
    const toDate=new Date(req.query.toDate) ;
    const qStatus=req.query.status;
    try {
       
        let order;
        if(qStatus){
           order= await Order.find({ 
                vendorId: req.params.id,
                createdAt: { $gte: fromDate,$lt:toDate} ,
                status:qStatus
                }).sort({createdAt:-1});
            
        }else{
          order=  await Order.find({ 
                vendorId: req.params.id,
                createdAt: { $gte: fromDate,$lt:toDate} 
                }).sort({createdAt:-1});
        }
        res.json({"data":order,'message':true});
    }catch(err){
        res.status(500).json({ 'data': err.message, "message": false})
    }
}

const getOrderWithKey=async (req,res)=>{
    const key=req.query.key;
    try {
       
       const order = await Order.find({ 
        vendorId: req.params.userId ,
            products: {$elemMatch: { productName: {$regex: key, $options: 'i'} }}
        }).sort({createdAt:-1}).limit(20);
        res.json({"data":order,'message':true});
    }catch(err){
        res.status(500).json({ 'data': err.message, "message": false})
    }
}
const updateStatusOrder=async (req,res)=>{
    try {
        if (!req?.params?.id) return res.status(400).json({ "success": 'Order ID required','message':false} );
        const order = await Order.findOne({ _id: req.params.id }).exec();
        if (!order) {
            return res.status(204).json({ 'message': `Order ID ${req.params.id} not found` ,'message':false});
        }
        if(order.vendorId==req.body.userId){
            const updateOrder=  await Order.findByIdAndUpdate(
                req.params.id,
                {
                    status:req.body.status
                },
                { new: true }
              );
            res.status(200).json({ "data":updateOrder,'message':true});
        }
    }catch(err){
        res.status(500).json({ 'data': err.message, "message": false})
    }
}

const countQuantityOrder=async (req,res)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    // const qLink=req.query.link;

    try {
        
        const data = await Order.aggregate([
            {$unwind: '$products'},
            { $match: { 
                    createdAt: { $gte: lastYear },
                 }
            },
            {
                $project: {
                month: { $month: "$createdAt" },
                number:{$sum:'$products.quantity'}
                },
            },
            {
                $group: {
                _id: "$month",
                total: { $sum: '$number' },
                },
            },
            { $sort : { _id : 1 } }
        ]);
        const dataLink = await Order.aggregate([
            {$unwind: '$products'},
            { $match: { 
                    createdAt: { $gte: lastYear },
                    "products.link":{ $ne:"" }
                 }
            },
            {
                $project: {
                month: { $month: "$createdAt" },
                number:{$sum:'$products.quantity'}
                },
            },
            {
                $group: {
                _id: "$month",
                total: { $sum: '$number' },
                },
            },
            { $sort : { _id : 1 } }
        ]);


        res.status(200).json({"data":data,"dataLink":dataLink,'message':true});
    } catch (err) {
    res.status(500).json(err);
    }
}





module.exports = {
    createOrder, 
    getOrdertByUserId,
    getOrderByNameOrderItem,
    getOrderWithDate,
    getOrderWithKey,
    updateStatusOrder,
    countQuantityOrder,
}