/**
 * Created by tejas on 27-07-2016.
 */


var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');


var studentfeedbackSchema = new mongoose.Schema ({
    
    

    studentid:{type:String, required: true},
    batchid:{type:String, required: true},
    trainername:{type:String, required: true},
    trainermail:{type:String, required: true},
    studname:{type:String, required: true},
    studmail:{type:String, required: true},
    studcenter:{type:String, required: true},
    studcourse:{type:String, required: true},
    revdate:{type:String, required: true},
    ratfaculty:{type:Number, required: true},
    ratinfra:{type:Number, required: true},
    ratsupport:{type:Number, required: true},
    totrating:{type:Number, required: true}
    
});

studentfeedbackSchema.plugin(timestamps);

module.exports =mongoose.model('StudentFeedbackModel',studentfeedbackSchema,'StudentFeedbackModel');

