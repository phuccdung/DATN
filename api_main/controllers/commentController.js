const Product = require('../model/Product');
const User = require('../model/User');
const Comment = require('../model/Comment');

const createComment= async (req, res) => {
    const newComment=new Comment(req.body);
    try{
        const product = await Product.findOne({ _id: req.body.productId });
        if (!product) {
            return res.status(204).json({ 'message': `Product ID ${req.body.productId} not found` ,'message':false});
        }
        let rating={
            "total":product.ratings.total+req.body.star,
            "count":product.ratings.count+1
        }
        const saveComment=await newComment.save();
        if(!saveComment){
            return res.status(204).json({ 'message': false });
        }  
        await Product.findByIdAndUpdate(
            {_id:req.body.productId},
            {
                $set:{
                    ratings:rating
                }
            },
        );
        res.json({"data":rating,'message':true});
    }catch(err){
        res.status(500).json(err);
    } 
}

const getCommentByIdProduct = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": false });
    try{
        const data=await Comment.aggregate( [
            {
               $lookup:
                  {
                     from: "users",
                     localField: "userId",
                     foreignField: "username",
                     as: "userInfo"
                 }
            },
            { $sort : { createdAt : -1 } },
            {$unwind: '$userInfo'},
            { $project:{
               "_id":"$_id",
                username:"$userInfo.username",
                "rating":"$star",
                "text":"$text",
                "img":"$userInfo.img",
             }
            },                
            
         ] )
        res.json({"data":data,'message':true});
    }catch(err){
        res.status(500).json({ 'data': err.message, "message": false})
    }
    
}

module.exports = {
    createComment,
    getCommentByIdProduct,
}