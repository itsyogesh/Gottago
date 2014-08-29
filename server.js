//Get the express packages we need

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var logger = require('morgan');
var passport  = require('passport');
var Toilet =  require('./models/toilet');
var User = require('./models/user');
var authController = require('./controllers/auth');
var toiletController = require('./controllers/toiletController');
var userController = require('./controllers/userController');
var clientController = require('./controllers/clientController');
var oauth2Controller = require('./controllers/oauth2');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

app.use(express.static(__dirname +'/public'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
//Use the passport package in our app
app.use(passport.initialize());

var MONGO_URL = "mongodb://yogesh:yogesh180592@kahana.mongohq.com:10083/gottago";	

var LOCAL_URL = "mongodb://localhost/gottago";

//Connecting to mongodb
mongoose.connect(LOCAL_URL);

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
	.post(authController.isAuthenticated, toiletController.postToilets)
	.get(toiletController.getToilets);

//Create endpoint handler for /toilets/nearby
router.route('/toilets/nearby')
	.get(toiletController.getNearby);

//Create endpoint handler for /toilets/:toilet_id
router.route('/toilets/:toilet_id')
	.get(toiletController.getToilet)
	.put(authController.isAuthenticated, toiletController.updateToilet)
	.delete(authController.isAuthenticated, toiletController.deleteToilet);

//Create endpoint handler for /users/
router.route('/users')
	.post(userController.postUsers)
	.get(authController.isAuthenticated, userController.getUsers);


//Create endpoint handler for /clients
router.route('/clients')
	.post(authController.isAuthenticated, clientController.postClients)
	.get(authController.isAuthenticated, clientController.getClients);

//Create endpoint handler for /oauth2 token
router.route('/oauth2/token')
	.post(oauth2Controller.token);


app.use('/api', router);


//Use defined port or use 3000
var port = process.env.PORT || 3000;

app.listen(port);
console.log('Listening to port ' + port + '...');

