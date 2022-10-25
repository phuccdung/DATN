const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const behaviorSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    actions:[
       { 
            id: { type: String},
            find:{
                type: String,
            },
            time:{
                type: Date,
            },
            count:{
                type: Number,
            },
            status:{
                type: String,
            }

        },
    ]
 
},
{ timestamps: true }
);

module.exports = mongoose.model('Behavior', behaviorSchema);