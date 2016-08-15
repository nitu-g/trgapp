var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');


var autoIncrement = require('mongoose-auto-increment');

var InquirySchema = new mongoose.Schema ({
  src:String,
  srcref:String,
  for:String,
  for1:String,
  for2:String,
  for3:String,
  loc:String,
  nature:String,
  corpname:String,
  date:String,
  handler:String,
  candname:String,
  candnum1:String,
  candnum2:String,
  candmail:String,
  candlinkin:String,
  candfacebook:String,
  candtwitter:String,
  educlass1:String,
  eduname1:String,
  eduloc1:String,
  eduyear1:String,
  educlass2:String,
  eduname2:String,
  eduloc1:String,
  eduyear1:String,
  educlass2:String,
  eduname2:String,
  eduloc1:String,
  eduyear1:String,
  exp:String,
  genexp:String,
  jobexp1:String,
  jobdet1:String,
  jobloc1:String,
  joblinux1:String,
  jobexp2:String,
  jobdet2:String,
  jobloc2:String,
  joblinux2:String,
  destrg:String,
  othCou:String,
  othfee:Number,
    othdur:String,
  desmon:String,
  startTime:String,
 endTime:String,
  desday:String,
  desloc:String,
  fosc:Number,
  dosc:String,
    stax:Number,
  dio:Number,
  da:String,
    netfee:Number,

    followdate1:Date,
    rem1:String,
    stat1:String,
    followdate2:Date,
    rem2:String,

    followdate3:Date,
    rem3:String,
  
 
  InquiryNum: Number,
  sumofdis:String
});

autoIncrement.initialize(mongoose.connection);
//InquirySchema.plugin(autoIncrement.plugin,'InquiryModel');
InquirySchema.plugin(autoIncrement.plugin, { model: 'InquiryModel',field:'InquiryNum',startAt:1,incrementBy:1});

//InquirySchema.plugin(autoIncrement.plugin, {model:'InquiryModel',field:'inquiryId',startAt:100,incrementBy:100});
// WaterSchema.plugin(mongoosastic);
// (model name, schema name, collection name)
//pls note that mongo pluralizes collection names...so better to specify it explicitly as in line below

InquirySchema.plugin(timestamps);
module.exports =mongoose.model('InquiryModel',InquirySchema,'InquiryModel');

