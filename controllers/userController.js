//Load required packages
var User = require('../models/user');

//Create endpoint for /api/users/ for POST
exports.postUsers = function(req, res){
	var user = new User({
		username : req.body.username,
		email : req.body.email,
		password : req.body.password
	});

	var username_value = req.body.username;
	var email_value = req.body.email;

	User.schema.path('email').validate(function(email_value, respond){
		User.findOne({email: email_value}, function(err, user){
			if(err)
				res.send(err);
			if(user)
				return respond(false);
			respond(true);
		});
	}, 'exists');

	User.schema.path('username').validate(function(username_value, respond){
		User.findOne({username: username_value}, function(err, user){
			if(err)
				res.send(err);
			if(user)
				return respond(false);
			respond(true);
		});
	}, 'exists');


	user.save(function(err){
		if(err)
			res.send(err);

		res.json({message: "New User added"});
	});
}

//Create endpoint for /api/users/ for GET
exports.getUsers = function(req, res){
	User.find(function(err, users){
		if(err)
			res.send(err);

		res.json(users);
	});
}