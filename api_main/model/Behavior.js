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
            type: Object,
        },
    ],
    search:[
        { 
            type: Object,
        },
    ]
 
},
{ timestamps: true }
);

module.exports = mongoose.model('Behavior', behaviorSchema);