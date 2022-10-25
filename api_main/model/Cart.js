const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    userId:{
        type:String,
        unique:true,
        require:true,
    },
    products:[
        {  
            type:Object,
        },
    ]
    
},
{ timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);