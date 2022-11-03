const User = require('../model/User');
const CryptoJS=require("crypto-js");


const getAllUsers = async (req, res) => {
    const qNew=req.query.new;
    try{
        let user;
        if(qNew){
             user=await User.find().limit(10);
        }else{
             user=await User.find({'roles.Admin': {$ne : "5150"}}, {
                username:1, 
                _id:1,
                img:1,
                name:1,
                roles:1,
            });
        }
        
        res.status(200).json(user)
    }catch(err){
        res.status(500).json(err);
    }
}

const getAllVendor=async (req,res)=>{
    const qNew=req.query.new;
    try{
        let user;
        if(qNew){
             user=await User.find({"roles.Editor":1984}).sort({createdAt:-1}).limit(5);
        }else{
             user=await User.find({"roles.Editor":1984});
        }
        
        res.status(200).json(user)
    }catch(err){
        res.status(500).json(err);
    }
}

const deleteUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": false });
    const user = await User.findOne({ _id: req.body.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': true });
    }
    const result = await user.deleteOne({ _id: req.body.id });
    res.json(result);
}

const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": false });
    const user = await User.findOne({ _id: req.params.id },{
        username:1, 
        _id:1,
        img:1,
        name:1,
        roles:1,
        phone:1,
        birthday:1,
        address:1,
        gender:1,
    }).exec();
    if (!user) {
        return res.status(204).json({"data":"", 'message': false });
    }
    res.json(user);
}
const updateUser=async(req, res)=>{
    if (!req?.params?.id) return res.status(400).json({ "message": false });
    if (req.body.roles) return res.status(400).json({ "message": false });
    const user = await User.findOne({ _id: req.body.userId }).exec();
    if (!user) {
        return res.status(204).json({ 'message': false });
    }
    if (user._id==req.params.id||user.roles?.Admin) {
        if(req.body.pwd){
            req.body.pwd=CryptoJS.AES.encrypt(
                req.body.pwd,
                process.env.PASS_SEC)
                .toString();
            user.password=req.body.pwd;
        }
        try{
            const updateUser=  await User.findByIdAndUpdate(
                req.params.id,
                {
                  $set: req.body,
                },
                { new: true }
              );
            res.json({"data":{
                "_id":updateUser._id,
                "name":updateUser.name,
                "img":updateUser.img,
                "username":updateUser.username,
                "roles":updateUser.roles,
                "phone":updateUser.phone,
                "address":updateUser.address,
                "birthday":updateUser.birthday,
            }, 'message': true });
        }catch(err){
            res.status(500).json({ "data":null,'message': err.message });
        }
    }else{
        return res.status(204).json({"data":null, 'message': false });
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

const countVendorStart=async (req,res)=>{
    const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { 
        createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
      { $sort : { _id : 1 } }
    ]);

    
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json(err);
  }
}
module.exports = {
    getAllUsers,
    getAllVendor,
    deleteUser,
    getUser,
    updateUser,
    updateUserToVendor,
    countVendorStart,
}