//Load required packages
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//Define our user schema
var UserSchema = new mongoose.Schema({
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

//Export the mongoose module
module.exports = mongoose.model('User', UserSchema);
