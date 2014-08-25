//Load required packages
var User = require('../models/user');

//Create endpoint for /api/users/ for POST
exports.postUsers = function(req, res){
	var user = new User({
		email : req.body.email,
		password ; req.body.password
	});

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