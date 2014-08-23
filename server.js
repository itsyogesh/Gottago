//Get the express packages we need

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var logger = require('morgan');
var Toilet =  require('./models/toilet');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

app.use(express.static(__dirname +'/public'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

var MONGO_URL = "mongodb://yogesh:yogesh180592@kahana.mongohq.com:10083/gottago";	

//Connecting to mongodb
mongoose.connect(MONGO_URL);

//Getting db connection
var db = mongoose.connection;

//Error handling in database
db.on('error', console.error.bind(console, 'connection error ...'));
db.once('open', function callback(){
	console.log("database is opened");
});

//Create our express router
var router = express.Router();

//Inital dummy route for testing
//http://localhost:3000/api
router.get('/', function(req, res){
	res.json({'message': 'A list of toilets'});
});

//Create a new route for /toilets
var toiletsRoute = router.route('/toilets');

//Create api endpoint for POST requests at /api/toilets/ 
toiletsRoute.post(function(req, res){
	//Create a new instance of the toilet model
	var toilet = new Toilet();

	toilet.name = req.body.name;
	var lat = parseFloat(req.body.lat);
	var lng = parseFloat(req.body.lng);
	toilet.loc = [lng, lat];
	toilet.address = req.body.address;
	toilet.details = req.body.details;
	req.images = req.body.images;
	req.ratings = req.body.ratings;
	req.gender = req.body.gender;
	req.is_handicapped = req.body.is_handicapped;
	req.fee = req.body.fee;
	req.style = req.body.style;

	//Save the object and check for errors
	toilet.save(function(err){
		if(err)
			res.send(err);

		res.json({ message: 'New toilet added'});
	});
});

//Create endpoint for /api/toilets GET requsts
toiletsRoute.get(function(req, res){
	//Use the toilet model to find all the toilets
	Toilet.find(function(err, toilets){
		if(err)
			res.send(err)

		res.json(toilets);
	});
});

//Create a new route for nearby toilets toilets/nearby
var nearbyRoute = router.route('/toilets/nearby');

//Create endpoint for /api/toilets/nearby GET requsts
nearbyRoute.get(function(req, res){
	//getting the current cooridinates of the user 	
	var lat = req.query.lat;
	var lng = req.query.lng;
	var query = Toilet.find({loc : { '$near': [lng, lat]}});
	query.limit(5);

	query.exec(function(err, toilets){
		if(err)
			res.send(err);

		res.json(toilets);
	});
});

//Create a new route with toilets/:toilet_id
var toiletRoute = router.route('/toilets/:toilet_id');

//Create endpoint for api/toilets/:toilet_id GET requsts
toiletRoute.get(function(req, res){
	//Use the toilet model to find a specific toilet
	Toilet.findById(req.params.toilet_id, function(err, toilet){
		if(err)
			res.send(err);

		res.json(toilet);
	});
});

//Create endpoint for DELETE in api/toilets/:toilet_id
toiletRoute.delete(function(req, res){
	//Use Toilet model to find and remove a single toilet
	Toilet.findByIdAndRemove(req.params.toilet_id, function(err){
		if (err)
			res.send(err);

		res.json({message: "Toilet removed from the database!" });

	});
});

//Register all our routes with /api
app.use('/api', router);

//Use defined port or use 3000
var port = process.env.PORT || 3000;

app.listen(port);
console.log('Listening to port ' + port + '...');

