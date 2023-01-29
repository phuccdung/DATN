const Link = require('../model/Link');
const User=require('../model/User');
const Product = require('../model/Product');

const createLink= async (req, res) => {
    const duplicate = await Link.findOne({ userId: req.body.userId,productId:req.body.productId }).exec();
    if(duplicate){
    return  res.json({"data":duplicate._id,'message':true});
    }
    const newLink=new Link(req.body);
    
    try{ 
        const saveLink=await newLink.save();
        res.json({"data":saveLink._id,'message':true});
    }catch(err){
        res.status(500).json(err);
    } 
}
const addChipOrder=async(req,res)=>{
    try{
        if (!req?.params?.id) return  res.send({'message': false});
        const foundLink = await Link.findOne({_id:req.params.id }).exec();
        if(!foundLink) {
            return res.status(204).json({ "data":"",'message': false });
        }
        const foundProduct=await Product.findOne({_id:foundLink.productId}).exec();
        if(!foundProduct) {
            return res.status(204).json({ "data":"",'message': false });
        }
        let sold=Number(foundLink.sold)+Number(req.body.quantity);
        let chip=Number(foundLink.chip)+Number(1)+Number((Number(req.body.quantity)*Number(req.body.price)*Number(foundProduct.discount)/100).toFixed(1));
         await Link.updateOne(
            {_id:req.params.id},
            {
                $set:{
                    sold:sold,
                    chip:chip,
                },
                $push:{
                    history:{
                        orderId:req.body.orderId,
                        quantity:req.body.quantity,
                        price:req.body.price,
                        discount:foundProduct.discount,
                        date:new Date().getTime(),
                    }
                }
            }
        )
        const user=await User.findOne({_id:foundLink.userId}).exec();
        if(!user) {
            return res.status(204).json({ "data":"",'message': false });
        }
        let c=Number(user.chip)+Number(1)+Number((req.body.quantity*req.body.price/10).toFixed(0));
        await User.updateOne(
            {_id:user._id},
            {
                $set:{
                    chip:c,
                }
            }
        )
        res.status(200).json({ 'message':true});
    }catch(err){
        res.status(500).json({ 'data': err.message, "message": false})
    }
}

const addChipView=async (req,res)=>{
    try{
        if (!req?.params?.id) return  res.send({'message': false})
        const foundLink = await Link.findOne({_id:req.params.id }).exec();
        if(!foundLink) {
            return res.status(204).json({ "data":"",'message': false });
        }
        let view=foundLink.view+1;
        let chip=foundLink.chip+0.1;
        await Link.updateOne(
            {_id:req.params.id},
            {
                $set:{
                    view:view,
                    chip:chip,
                }
            }
        )
        const user=await User.findOne({_id:foundLink.userId}).exec();
        if(!user) {
            return res.status(204).json({ "data":"",'message': false });
        }
        let c=user.chip+0.1;
        await User.updateOne(
            {_id:user._id},
            {
                $set:{
                    chip:c,
                }
            }
        )
        return res.status(200).json({ 'message': true });
    }catch(err){
        res.status(500).json(err);
    }
}
const getLinkByUserId= async (req, res) => {
    try{ 
        const isVendor=req.query.isVendor;
        if(isVendor=="true"){
            const data =await Link.aggregate([
                { $addFields: { "product": { $toObjectId: "$productId" }}},
                { $addFields: { "user": { $toObjectId: "$userId" }}},
                {
                    $lookup:{
                        from:"products",
                        localField:"product",
                        foreignField:"_id",
                        as:"productInfo"
                    }
                },
                {$unwind: '$productInfo'},
                {
                    $match:{
                        "productInfo.userId":req.params.userId,
                    }
                },
                {
                    $lookup:{
                        from:"users",
                        localField:"user",
                        foreignField:"_id",
                        as:"userinfo"
                    }
                },
                {$unwind: '$userinfo'},
                {
                    $project:{
                        chip:1,
                        view:1,
                        sold:1,
                        "title":"$productInfo.title",
                        "img":"$productInfo.img",
                        "username":"$userinfo.username",
                        
                    }
                },
                {$sort:{chip:-1}},
                {
                    $limit:10
                }

            ])
            res.json({"data":data,'message':true});
        }else{
            const data=await Product.aggregate([
                { $addFields: { "productId": { $toString: "$_id" }}},
                {
                    $lookup:
                    {
                        from: "links",
                        localField: "productId",
                        foreignField: "productId",
                        as: "linkInfo"
                    }
                },
                {$unwind: '$linkInfo'},
                { $match: { 
                    "linkInfo.userId":req.params.userId
                    }
                },
                {
                    $project:{
                        _id:1,
                        img:1,
                        title:1,
                        "chip":'$linkInfo.chip',
                        "sold":'$linkInfo.sold',
                        "view":'$linkInfo.view',
                        "link":'$linkInfo._id',
    
                    }
                },
                {
                    $sort:{
                        chip:-1
                    }
                }
            ])
            res.json({"data":data,'message':true});
        }
    }catch(err){
        res.status(500).json(err);
    } 
}


module.exports = {
    createLink,
    addChipView,
    addChipOrder,
    getLinkByUserId
}