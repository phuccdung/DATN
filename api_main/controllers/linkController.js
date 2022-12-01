const Link = require('../model/Link');

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
        return res.status(200).json({ 'message': true });
    }catch(err){
        res.status(500).json(err);
    }
}


module.exports = {
    createLink,
    addChipView,
}