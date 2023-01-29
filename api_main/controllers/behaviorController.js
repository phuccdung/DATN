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
        return res.send({'message': false})
    }
    const dateUpdate=new Date().setTime(behavior.updatedAt);

    const time=req.body.action.date-dateUpdate;
    // res.json({"data":time,'message':true});
    const user=await User.findById(req.body.userId);
    if(user._id!=req.params.userId){
        return res.send({'message': false})
    }
    try{
        await Behavior.findByIdAndUpdate({_id:behavior._id},{$push:{actions:req.body.action}}); 
        res.json({"data":time,'message':true});
    }catch(err){
        res.status(500).json({ 'data': err.message , "message": false});
    }
}
const addArrAction=async (req, res) => {
    if (!req?.params?.userId) return res.status(400).json({ "message": false });
    const behavior = await Behavior.findOne({ userId: req.params.userId }).exec();
    if (!behavior) {
        return res.status(204).json({ 'message': false });
    }
    // res.status(200).json({"data":req.body,'message':true});
    const user=await User.findById(req.body.userId);
    if(user._id!=req.params.userId){
        return res.status(204).json({ 'message': false });
    }
    try{
        const result=await Behavior.updateOne(
                {_id:behavior._id},
                { $push: { actions: { $each: req.body.arr } } }
            );
        res.json({"data":result,'message':true});
    }catch(err){
        res.status(500).json({ 'data': err.message , "message": false});
    }
}

const addArrKeyWords=async (req, res) => {
    if (!req?.params?.userId) return res.status(400).json({ "message": false });
    const behavior = await Behavior.findOne({ userId: req.params.userId }).exec();
    if (!behavior) {
        return res.status(204).json({ 'message': false });
    }
    // res.status(200).json({"data":req.body,'message':true});
    const user=await User.findById(req.body.userId);
    if(user._id!=req.params.userId){
        return res.status(204).json({ 'message': false });
    }
    try{
        const result=await Behavior.updateOne(
                {_id:behavior._id},
                { $push: { search: { $each: req.body.arr } } }
            );
        res.json({"data":result,'message':true});
    }catch(err){
        res.status(500).json({ 'data': err.message , "message": false});
    }
}

const analytics=async (req, res) => {
    const date=new Date()
    const lastDate=new Date(date.setDate(date.getDate()-req.params.day));
    const status=req.query.status
    try {
        let data;
        if(status){
            data = await Behavior.aggregate(
                [
                    {$unwind: '$actions'},
                    { $match: { 
                        "actions.date": { $gte: lastDate } ,
                        "actions.status":status
                         } 
                    },
                    {$group: 
                        {
                            _id: {
                                id:'$actions.find',
                                name:'$actions.name',
                            }, 
                            total: {$sum: 1}}
                    },
                ]
            );
        }else{
             data = await Behavior.aggregate(
                [
                    {$unwind: '$actions'},
                    { $match: { 
                        "actions.date": { $gte: lastDate } 
                         } 
                    },
                    {$group: 
                        {
                            _id: {
                                id:'$actions.find',
                                name:'$actions.name',
                            }, 
                            total: {$sum: 1}}
                    },
                ]
            );
        }

        
        res.status(200).json({"data":data, "message":true})
    }catch(err){
        res.status(500).json({ 'data': err.message, "message": false})
    }
}

const analyticsKey=async (req, res) => {
    const date=new Date()
    const lastDate=new Date(date.setDate(date.getDate()-req.params.day));
    try {
        let data;
        if(req.query.type==="key_Ex"){

            data = await Behavior.aggregate(
              [
                  {$unwind: '$search'},
                  { $match: { 
                      "search.date": { $gte: lastDate } ,
                      "search.sysKey":1
                          } 
                  },
                  {$group: {_id: '$search.key', total: {$sum: 1}}},
                  { $limit : 50 }
              ]
          );        
        }else{
            data = await Behavior.aggregate(
              [
                  {$unwind: '$search'},
                  { $match: { 
                      "search.date": { $gte: lastDate } ,
                      "search.sysKey":{ $ne:1 }
                          } 
                  },
                  {$group: {_id: '$search.key', total: {$sum: 1}}},
                  { $limit : 50 }
              ]
          ); 
        }
        res.status(200).json({"data":data, "message":true})
    }catch(err){
        res.status(500).json({ 'data': err.message, "message": false})
    }
}
const analyticsByUserId=async (req, res) => {
    const date=new Date()
    const lastDate=new Date(date.setDate(date.getDate()-7));
    try {
        const  data1 = await Behavior.aggregate(
            [
                {$unwind: '$actions'},
                { $match: { 
                    "actions.date": { $gte: lastDate } ,
                    "userId":req.params.userId
                        } 
                },
                {$group: {
                    _id: {
                        id:'$actions.find',
                        name:'$actions.name',
                    } , 
                    total: {$sum: 1}}},
                { $limit : 50 }
            ]
        );  
        const  data2 = await Behavior.aggregate(
            [
                {$unwind: '$search'},
                { $match: { 
                    "search.date": { $gte: lastDate } ,
                    "userId":req.params.userId
                        } 
                },
                {$group: {_id: '$search.key', total: {$sum: 1}}},
                { $limit : 20 }
            ]
        );       
        res.status(200).json({"data":{"action":data1,"search":data2}, "message":true})
    }catch(err){
        res.status(500).json({ 'data': err.message, "message": false})
    }
}

const checkLinkByProduct=async(req,res)=>{
    const userId=req.query.userId;
    const productId=req.query.productId;
    const date=new Date()
    const lastDate=new Date(date.setDate(date.getDate()-7));
    try{
        if(userId&&productId){
           const data = await Behavior.aggregate(
                [
                    {$unwind: '$actions'},
                    { $match: { 
                        "actions.date": { $gte: lastDate } ,
                        "userId":userId,
                        "actions.find":productId
                         } 
                    },
                    {
                        $project:{
                            _id:0,
                            link:"$actions.link",
                            date:"$actions.date"
                        }
                    },
                    { $sort : { date : -1 } },  
                ]
            );
         return   res.status(200).json({"data":data, "message":true})
        }
        res.status(500).json({ 'data': "", "message": false})
    }catch(err){
        res.status(500).json({ 'data': err.message, "message": false})
    }
}

module.exports = {
    createBehavior,
    addAction,
    addArrAction,
    addArrKeyWords,
    analytics,
    analyticsKey,
    analyticsByUserId,
    checkLinkByProduct
}