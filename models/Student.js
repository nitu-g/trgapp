var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Inquiry = require('./InquiryBody.js')

var studentSchema = new mongoose.Schema ({
  inquiryId:{type: mongoose.Schema.Types.ObjectId, ref: 'Inquiry', unique: true},
  name:{type:String, required: true},
  email:{type:String, required: true, index : true},
  phone:{type:Number, required: true},
  loc:{type:String, required: true},
  course:{type:String, required: true},
  fee:{type:Number, required: true},
  feeSubmStatus:{type:String, required: true},
  regFee:{type:Number, required: true},
  regDate:{type:Date, required: true},
  firInsFee:{type:Number, required: true},
  firInsDate:{type:Date},
  secInsFee:{type:Number, required: true},
  secInsDate:{type:Date},
  actFeeAmt:{type:Number},
  status:{type:String, required: true}, // Batch Status
  batchId:{type:String},  
  traCompleted:{type:String, default:"Not Completed"},
  certifIssu:{type:String, default:"No"},
  certifDate:{type:Date},
  feedbaSubm:{type:String, default:"No"},
  remarks:{type:String},
});

studentSchema.plugin(timestamps);

module.exports =mongoose.model('StudentModel',studentSchema,'StudentModel');
