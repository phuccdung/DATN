const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var starts = new Schema({
    total:Number,
    count:Number,
 });
const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    desc:{
        type: String,
    },
    detail:[String],
    ratings:{
        type:starts,
        default:{
            total:0,
            count:0,
        }
    },
    userId: {
        type: String,
        required: true
    },
    userName:{
        type: String,
    },
    status:{
        type:String,
        default:"waiting",
    },
    stock:{
        type:Number,
        default:0,
    },
    img:{
        type:String,
    },
    category:{
        type:String,
    }
    
},
{ timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);