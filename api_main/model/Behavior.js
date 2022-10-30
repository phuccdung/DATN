const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var action = new Schema({
    find: String,
    date: Date,
    status:String
  });
var key = new Schema({
    key: String,
    date: Date,

});
const behaviorSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    actions:[
        action
    ],
    search:[
        key
    ]
 
},
{ timestamps: true }
);

module.exports = mongoose.model('Behavior', behaviorSchema);