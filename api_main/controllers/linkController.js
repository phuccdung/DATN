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
        let sold=Number(foundLink.sold)+Number(req.body.quantity);
        let chip=Number(foundLink.chip)+Number(10)+Number((req.body.quantity*req.body.price/10).toFixed(0));
        await Link.updateOne(
            {_id:req.params.id},
            {
                $set:{
                    sold:sold,
                    chip:chip,
                }
            }
        )
        const user=await User.findOne({_id:foundLink.userId}).exec();
        if(!user) {
            return res.status(204).json({ "data":"",'message': false });
        }
        let c=Number(user.chip)+Number(10)+Number((req.body.quantity*req.body.price/10).toFixed(0));
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
        let chip=foundLink.chip+10;
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
        let c=user.chip+10;
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
        ])
        res.json({"data":data,'message':true});
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