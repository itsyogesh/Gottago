//Load required packages
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//Define our user schema
var UserSchema = new mongoose.Schema({
	username : {
		type: String,
		unique: true,
		required: true
	},
	email : {
		type: String, 
		unique: true,
		required: true
	},
	password : {
		type: String,
		required : true
	}
});

//Execute before each user.save() call
UserSchema.pre('save', function(callback){
	var user = this;

	//Breakout if the password hasn't changed
	if(!user.isModified('password'))
		return callback();

	bcrypt.genSalt(5, function(err, salt){
		if(err)
			return callback(err);

		bcrypt.hash(user.password, salt, null, function(err, hash){
			if (err) 
				return callback(err);
			user.password = hash;
			callback();
		});
	});
});

UserSchema.methods.verifyPassword = function(password, cb){
	bcrypt.compare(password, this.password, function(err, isMatch){
		if(err)
			return cb(err);

		cb(null, isMatch);
	});
};


//Export the mongoose module
module.exports = mongoose.model('User', UserSchema);
