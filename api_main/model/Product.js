const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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