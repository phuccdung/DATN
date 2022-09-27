const User = require('../model/User');
const CryptoJS=require("crypto-js");


const getAllUsers = async (req, res) => {
    const qNew=req.query.new;
    try{
        let user;
        if(qNew){
             user=await User.find().limit(10);
        }else{
             user=await User.find();
        }
        
        res.status(200).json(user)
    }catch(err){
        res.status(500).json(err);
    }
}

const deleteUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.body.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.body.id} not found` });
    }
    const result = await user.deleteOne({ _id: req.body.id });
    res.json(result);
}

const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
    }
    res.json(user);
}
const updateUser=async(req, res)=>{
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
    if (req.body.roles) return res.status(400).json({ "message": 'User Can update' });
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
    }
    if(req.body.pwd){
        req.body.pwd=CryptoJS.AES.encrypt(
            req.body.pwd,
            process.env.PASS_SEC)
            .toString();
        user.password=req.body.pwd;
    }
    try{
        const result = await user.save();
        res.json(result);
    }catch(err){
        res.status(500).json({ 'message': err.message });
    }
}

const updateUserToVendor=async(req, res)=>{
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
    }
    user.roles={
         "Editor": 1984,
         "User": 2001
    }
    try{
        const result = await user.save();
        res.json(result);
    }catch(err){
        res.status(500).json({ 'message': err.message });
    }
}
module.exports = {
    getAllUsers,
    deleteUser,
    getUser,
    updateUser,
    updateUserToVendor,
}