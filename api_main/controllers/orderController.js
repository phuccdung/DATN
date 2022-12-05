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
const getOrder=async(req,res)=>{
    try{
        const fromDate=new Date(req.query.fromDate);
        const toDate=new Date(req.query.toDate);
        const qLimit=req.query.limit;
        let data;
        if(qLimit==="true"){
            data= await Order.find().sort({updatedAt:-1}).limit(5);
            return res.status(200).json({ "data":data,'message':true});
        }else{
            data= await Order.aggregate([
                { $addFields: { "vendor": { $toObjectId: "$vendorId" }}},
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "vendor",
                        foreignField: "_id",
                        as: "userInfo"
                    }
                },
                {$unwind: '$userInfo'},
                {$match:{
                    "createdAt": { $gte: fromDate,$lt:toDate} ,
                }},
                {
                    $project:{
                        _id:1,
                        vendorName:"$userInfo.name",
                        address:1,
                        total:1,
                        name:1,
                        phone:1,
                        status:1
                    }
                },
                
             ])
        }
        res.status(200).json({ "data":data,'message':true});
    }catch(err){
        res.status(500).json({ 'data': err.message, "message": false})
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
    const toDate=new Date(req.query.toDate);
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

const countProductIdtWithDate=async(req,res)=>{
    const fromDate=new Date(req.query.fromDate) ;
    const toDate=new Date(req.query.toDate);

    try{
        let data;
        let dataLink;
        data = await Order.aggregate([
            {$unwind: '$products'},
            { $match: { 
                createdAt: { $gte: fromDate,$lt:toDate} ,
                vendorId: req.params.id,
                }
            },
            {
                $group: {
                    _id:{
                        productId:"$products.productId",
                        productName:"$products.productName"
                    } ,
                    
                    total:{$sum:"$products.quantity"}
                },
            },
            {
                $project:{total:1,_id:1,}
            }
            
        ]);

        dataLink = await Order.aggregate([
            {$unwind: '$products'},
            { $match: { 
                createdAt: { $gte: fromDate,$lt:toDate} ,
                vendorId: req.params.id,
                "products.link":{ $ne:"" },
                }
            },
            {
                $group: {
                    _id: "$products.productId",
                    total:{$sum:"$products.quantity"}
                },
            },
            {
                $project:{total:1,_id:1}
            }
            
        ]);
        res.status(200).json({"data":data,"dataLink":dataLink, "message":true})
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
        
            const updateOrder=  await Order.findByIdAndUpdate(
                req.params.id,
                {
                    status:req.body.status
                },
                { new: true }
              );
            res.status(200).json({ "data":updateOrder,'message':true});
        
    }catch(err){
        res.status(500).json({ 'data': err.message, "message": false})
    }
}

const countQuantityOrder=async (req,res)=>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    const qProductId=req.query.productId;

    try {
        let data;
        let dataLink;
        
        if(qProductId){
            data = await Order.aggregate([
                {$unwind: '$products'},
                { $match: { 
                        createdAt: { $gte: lastYear },
                        "products.productId":qProductId,
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
             dataLink = await Order.aggregate([
                {$unwind: '$products'},
                { $match: { 
                        createdAt: { $gte: lastYear },
                        "products.link":{ $ne:"" },
                        "products.productId":qProductId,
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
        }else{            
            data = await Order.aggregate([
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
            dataLink = await Order.aggregate([
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
        }


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
    countProductIdtWithDate,
    getOrder
}