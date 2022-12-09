const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var productDetail = new Schema({
    productId:String,
    productName: String,
    quantity:Number,
    price:Number,
    imgUrl:String,
    link:String,
  });
var historyDetail=new Schema({
    status:String,
    date:Date,
})
const orderSchema = new Schema({
    userId:{
        type:String,
    },
    vendorId:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    products:[
        productDetail
    ],
    history:[
        historyDetail
    ],
    total:{
        type:Number,
    },
    phone:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    img:{
        type:String,
    },
    status:{
        type:String,
        default:"Pending"
    },
    isPay:{
        type:Boolean,
        default:false
    }
    
},
{ timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);