const Cart = require('../model/Cart');
const User = require('../model/User');

const createCart= async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        return res.status(204).json({ 'message': false });
    }
    const newCart=new Cart({"userId":user._id});
    try{
        await newCart.save();
        res.status(200).json({ 'success': ` created!`,'message':true });
    }catch(err){
        res.status(500).json(err);
    } 
}

const getCartByuserId = async (req, res) => {
    if (!req?.params?.userId) return res.status(400).json({ "message": false });
    const cart = await Cart.findOne({ userId: req.params.userId }).exec();
    if (!cart) {
        return res.status(204).json({ 'message': false });
    }
    res.json({"data":cart,'message':true});
}

const updateCartByUserId = async (req, res) => {
    if (!req?.params?.userId) return res.status(400).json({ "message": false });
    const cart = await Cart.findOne({ userId: req.params.userId }).exec();
    if (!cart) {
        return res.status(204).json({ 'message': false });
    }
    const user=await User.findById(req.body.userId);
    if(user._id!=req.params.userId){
        return res.status(204).json({ 'message': false });
    }
    try{
        cart.products=req.body.products;
        const result=await cart.save();
        res.json({"data":result,'message':true});
    }catch(err){
        res.status(500).json({ 'data': err.message , "message": false});
    } 
}



module.exports = {
    createCart,
    getCartByuserId,
    updateCartByUserId,
}