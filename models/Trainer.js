var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');


var TrainerSchema = new mongoose.Schema ({
  
  trgloc:{type:String, required: true},
  trainername:{type:String, required: true},
  email:{type:String, required: true, index: true, unique: true},
  wkdaycapa:{type:Number, required: true},
  actwkdaystren:{type:Number, default: 0},
  wkendcapa:{type:Number, required: true},
  actwkendstren:{type:Number,  default: 0},
  remarks:String,
  courses: {type:Array, required: true}
});

TrainerSchema.plugin(timestamps);

// (model name, schema name, collection name)
//pls note that mongo pluralizes collection names...so better to specify it explicitly as in line below

module.exports = mongoose.model('TrainerModel',TrainerSchema,'TrainerModel');
