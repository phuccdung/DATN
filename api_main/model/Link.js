const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var historyDetail =new Schema({
  quantity:Number,
  price:Number,
  discount:Number,
  date:Date,
})

const linkSchema = new Schema({
  userId:{
    type: String,
    required: true
  },
  productId:{
    type: String,
    required: true
  },
  sold:{
    type:Number,
    default:0,
  },
  view:{
    type:Number,
    default:0,
  },
  chip:{
    type:Number,
    default:0,
  },
  history:[
    historyDetail
  ]
},
{ timestamps: true }
);

module.exports = mongoose.model('Link', linkSchema);