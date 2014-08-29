//Load required packages
var mongoose = require('mongoose');
var Random = require('../controllers/random');

var ClientSchema = new mongoose.Schema({
	name: {type: String, unique: true, required: true},
	id: {type: String, unique: true, required: true, default: Random.randomString(16)},
	secret: {type: String, unique: true, required: true, default:Random.randomBase64String(32)},
	userId : {type: String, required: true}
});

module.exports = mongoose.model('Client', ClientSchema);