/**
 * Created by tejas on 01-08-2016.
 */

var mongoose = require('mongoose');

// var mongoosastic = require('mongoosastic');
var bcrypt = require('bcryptjs'),
    SALT_WORK_FACTOR = 10;


var emailSchema = new mongoose.Schema ({
    username:{type:String, required: true, index : {unique: true}},
    password:String
});








module.exports =mongoose.model('emailModel',emailSchema,'emailModel');


