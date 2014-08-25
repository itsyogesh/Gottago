//Get the express packages we need

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var logger = require('morgan');
var Toilet =  require('./models/toilet');
var toiletController = require('/controllers/toiletController');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

app.use(express.static(__dirname +'/public'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

var MONGO_URL = "mongodb://yogesh:yogesh180592@kahana.mongohq.com:10083/gottago";	

var LOCAL_URL = "mongodb://localhost/gottago";

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

//Create endpoint handler for /toilets
router.route('/toilets')
	.post(toiletController.postToilets)
	.get(toiletController.getToilets);

//Create endpoint handler for /toilets/nearby
router.route('/toilets/nearby')
	.get(toiletController.getNearby);

//Create endpoint handler for /toilets/:toilet_id
router.route('/toilets/:toilet_id')
	.get(toiletController.getToilet)
	.put(toiletController.updateToilet)
	.delete(toiletController.deleteToilet);

//Create endpoint handler for /toilets/:toilet_id/addrating
router.route('/toilets/:toilet_id/addrating')
	.post(toiletController.addRating);

app.use('/api', router);

//Use defined port or use 3000
var port = process.env.PORT || 3000;

app.listen(port);
console.log('Listening to port ' + port + '...');

