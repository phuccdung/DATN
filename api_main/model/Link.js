const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  }
},
{ timestamps: true }
);

module.exports = mongoose.model('Link', linkSchema);