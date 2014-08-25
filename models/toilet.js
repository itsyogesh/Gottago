//Get the required packages

var mongoose = require('mongoose');

//Define our toilet schema
var ToiletSchema = new mongoose.Schema({
	'name' : {type: String, required: true},
	'loc': [],
	'address': {type: String},
	'details': {type: String, required: true},
	'images': [Images],
	'ratings': [Ratings],
	'overall_rating':{type: Number, min: 0, max: 5, default: 0},
	'gender': {type: String, enum: ['male', 'female', 'both'], default: 'both'},
	'is_handicapped': {type: Boolean},
	'shower_facility': {type: Boolean, default: false},
	'charges': {type: Number, default: 0},
	'hours': [Hours],
	'style': {type: String, enum: ['indian', 'western', 'both', 'toilet_bowl']},
	'added_by': {type: String, default: "Anonymous"},
	'edited_by': [EditedBy],
	'created': {type: Date, default: Date.now},
	'updated': {type: Date, default: Date.now}
});


//Defining Images Schema
var Images = new mongoose.Schema({
	url : {type: String}
});

//Defining Rating Schema
var Ratings = new mongoose.Schema({
	'userId' : {type: String},
	'comment' : {type: String},
	'rating' : {type: Number, min: 0, max: 5, default: 0}
});

//Defining edited by users schema
var EditedBy = new mongoose.Schema({
	'userId' : {type: String},
	'time' : {type: Date}
});

var Hours = new mongoose.Schema({
	'open_time': {type: Number, default: 0, min: 0, max: 2400},
	'close_time': {type: Number, default: 2400, min: 0, max: 2400 }
});

//Adding ratings to the toilet
ToiletSchema.prototype.addRatings  = function(toiletId, rating, callback){
	this.findById(toiletId, function(error, toilet){
		if(error){
			callback(error);
		}

		else{
			toilet.ratings.push(rating);

			//Updating overall_rating
			var sum=0, no_of_ratings=0;
			for(user_rating in toilet.ratings){
				if(toilet.ratings[user_rating].rating > 0){
					sum += toilet.ratings[user_rating].rating;
					no_of_ratings++;
				}
			}
			toilet.overall_rating = Math.ceil(sum/no_of_ratings);

			toilet.save(function (err){
				if(!err){
					callback();
				}
			});
		}
	});
}


//Indexing the toilet schema
ToiletSchema.index({ loc : '2d'});

//Export the toilet model
module.exports = mongoose.model('Toilet', ToiletSchema);
