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


module.exports = {
    createOrder, 
}