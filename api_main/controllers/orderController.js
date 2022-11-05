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
                products: {$elemMatch: { productName: {'$regex': new RegExp("^" + qKey.toLowerCase(), "i")} }}
            }).sort({createdAt:-1}).limit(20);
            res.json({"data":order,'message':true});
            
        }else{
            order = await Order.find({ 
                userId: req.params.userId ,
                products: {$elemMatch: { productName: {'$regex': new RegExp("^" + qKey.toLowerCase(), "i")} }}
            }).sort({createdAt:-1}).limit(20);
            res.json({"data":order,'message':true});
        }
        
        // res.json({"data":qKey,'message':true});
    }catch(err){
        res.status(500).json(err);
    }
}

module.exports = {
    createOrder, 
    getOrdertByUserId,
    getOrderByNameOrderItem,
}