//Get the required packages

var mongoose = require('mongoose');

//Define our toilet schema
var ToiletSchema = new mongoose.Schema({
	'name' : {type: String, required: true},
	'loc': [],
	'address': {type: String},
	'details': {type: String, required: true},
	'images': [Images],
	'rating': {type: Number},
	'gender': {type: String, enum: ['male', 'female', 'both']},
	'is_handicapped': {type: Boolean},
	'fee': {type: Number},
	'style': {type: String, enum: ['indian', 'western']},
	'created': {type: Date, default: Date.now},
	'updated': {type: Date, default: Date.now}
});

//Defining Images Schema
var Images = new mongoose.Schema({
	url : {type: String}
});

//Indexing the toilet schema
ToiletSchema.index({ loc : '2d'});

//Export the toilet model
module.exports = mongoose.model('Toilet', ToiletSchema);
