const Behavior =require("../model/Behavior");
const User = require('../model/User');

const createBehavior= async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
        return res.status(204).json({ 'message': false });
    }
    const newBehavior = new Behavior({"userId":user._id});
    try{
        await newBehavior.save();
        res.status(200).json({ 'success': ` created!`,'message':true });
    }catch(err){
        res.status(500).json(err);
    } 
}

const addAction=async (req, res) => {
    if (!req?.params?.userId) return res.status(400).json({ "message": false });
    const behavior = await Behavior.findOne({ userId: req.params.userId }).exec();
    if (!behavior) {
        return res.status(204).json({ 'message': false });
    }
    // res.json({"data":behavior,'message':true});
    const user=await User.findById(req.body.userId);
    if(user._id!=req.params.userId){
        return res.status(204).json({ 'message': false });
    }
    try{
        const result=await Behavior.findByIdAndUpdate({_id:behavior._id},{$push:{actions:req.body.action}});
        res.json({"data":result,'message':true});
    }catch(err){
        res.status(500).json({ 'data': err.message , "message": false});
    }
}

module.exports = {
    createBehavior,
    addAction,
}