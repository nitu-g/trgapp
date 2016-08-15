var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var batchSchema = new mongoose.Schema ({
  loc:{type:String, required: true},
  course:{type:String, required: true},
  trainer:{type:String, required: true},
  trainername:{type:String, required: true},
  starttimeslot:{type:String, required: true},
  endtimeslot:{type:String, required: true},
  plstartdate:{type:Date, required: true},
  plenddate:{type:Date, required: true},
  plduration:{type:Number, required: true},
  actstartdate:{type:Date},
  actenddate:{type:Date},
  id:{type:String, required: true, index : true, unique: true},
  targetstren:{type:Number, required: true},
  actualstren:{type:Number, required: true},
  status:{type:String, required: true},
  remarks:String,
});

batchSchema.plugin(timestamps);

module.exports =mongoose.model('BatchModel',batchSchema,'BatchModel');

