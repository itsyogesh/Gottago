//Load required packages
var Client = require('../models/client');

exports.postClients = function(req, res) {
	//Create a new client
	var client = new Client();

	client.name = req.body.name;
	client.userId = req.user._id;

	//Save the client and check for errors
	client.save(function (err) {
		if(err){
			res.send(err);
		}
		res.json({ message: "Client Added to the app"});
	});
};

exports.getClients = function(req, res){
	//Use the client model to find all the Clients
	Client.find({userId: req.user._id}, function(err, clients){
		if(err)
			res.send(err);
		res.json(clients);
	});
};