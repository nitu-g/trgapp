var mongoose = require('mongoose');

// var mongoosastic = require('mongoosastic');
var bcrypt = require('bcryptjs'),
SALT_WORK_FACTOR = 10;

var userSchema = new mongoose.Schema ({
  firstName:String,
  lastName:String,
  username:{type:String, required: true, index : {unique: true}},
  inlineRadioOptions:String,
  password:String
});

userSchema.pre('save', function(next) {

	console.log('Pre functio');
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});


userSchema.methods.comparePassword = function(userPassword, cb) {
	console.log('in userSchema comparePassword function', userPassword, bcrypt.compare(userPassword, this.password));
    bcrypt.compare(userPassword, this.password, function(err, isMatch) {
    	console.log(err);
    	console.log(isMatch);
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// WaterSchema.plugin(mongoosastic);
// (model name, schema name, collection name)
//pls note that mongo pluralizes collection names...so better to specify it explicitly as in line below

module.exports =mongoose.model('userModel',userSchema,'userModel');
//mongoose.model('userModel', userSchema);
