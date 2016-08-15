var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

var courseSchema = new mongoose.Schema ({
  id:{type:String, required: true, index: true, unique: true},
  name:{type:String, required: true,unique:true},
  fee:{type:Number, required: true},
  regfee:{type:Number, required: true},
  firinsfee:{type:Number, required: true},
  secinsfee:{type:Number, required: true},
  srvctax:{type:Number, required: true},
  totalfee:{type:Number, required: true},
  duration:{type:Number, required: true},
  remarks:String,
  status:{type:String, required: true}
});

courseSchema.plugin(timestamps);

module.exports =mongoose.model('CourseModel',courseSchema,'CourseModel');

