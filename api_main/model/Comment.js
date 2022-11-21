const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  userId:{
    type: String,
    required: true
  },
  productId:{
    type: String,
    required: true
  },
  star:{
    type: Number,
    required: true
  },
  text:{
    type: String,
    required: true
  },
    
},
{ timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);