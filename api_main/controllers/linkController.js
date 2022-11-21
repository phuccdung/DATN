const Link = require('../model/Link');

const createLink= async (req, res) => {
    const duplicate = await Link.findOne({ userId: req.body.userId,productId:req.body.productId }).exec();
    if(duplicate){
    //   return  res.json({"data":"Link has been exist...",'message':true});
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


module.exports = {
    createLink
}