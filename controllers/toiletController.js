//Load required packages
var Toilet = require('../models/toilet');

exports.postToilets = function(req, res){
	//Create a new instance of the toilet model
	var toilet = new Toilet();

	var user_rating = {
		userId : req.user._id,
		comment : req.body.comment,
		rating : req.body.rating
	}

	var images = {
		url : req.body.image_url
	}

	var hours = {
		open_time : req.body.open_time,
		close_time : req.body.close_time
	}

	var edited_by = {
		userId : req.user._id,
		time : Date.now()
	}

	toilet.name = req.body.name;
	var lat = parseFloat(req.body.lat);
	var lng = parseFloat(req.body.lng);
	toilet.loc = [lng, lat];
	toilet.address = req.body.address;
	toilet.details = req.body.details;
	toilet.images = [images];
	toilet.ratings = [user_rating];
	toilet.overall_rating = user_rating.userId;
	toilet.gender = req.body.gender;
	toilet.is_handicapped = req.body.is_handicapped;
	toilet.shower_facilty = req.body.shower_facility;
	toilet.charges = req.body.charges;
	toilet.hours = [hours];	
	toilet.style = req.body.style;
	toilet.added_by = req.user._id;	
	toilet.edited_by = [edited_by];

	//Save the object and check for errors
	toilet.save(function(err){
		if(err)
			res.send(err);

		res.json({ message: 'New toilet added'});
	});
}

//Create endpoint /api/toilets/ for GET
exports.getToilets = function(req, res){
	//Use the Toilet model to find all the toilets
	Toilet.find(function(err, toilets){
		if(err)
			res.send(err);

		res.json(toilets);
	});
}

//Create endpoint for /api/toilets/nearby GET requests
exports.getNearby = function(req, res){
	var lat = req.query.lat;
	var lng = req.query.lng;
	var query = Toilet.find({loc : {'$near': [lng, lat]}});
	query.limit(5);

	query.exec(function(err, toilets){
		if(err)
			res.send(err);

		res.json(toilets);
	});
}

//Create endpoint fpr /api/toilets/:toilet_id GET requests
exports.getToilet = function(req, res){
	//Use Toilet model to find a specific toilet
	Toilet.findById(req.params.toilet_id, function(err, toilet){
		if(err)
			res.send(err);

		res.json(toilet);
	});
}

//Create endpoint for /api/toilets/:toilet_id UPDATE requests
exports.updateToilet = function(req, res){
	//Use Toilet model to find and update a specific toilet
	Toilet.findById(req.params.toilet_id, function(err, toilet){
		if(err)
			res.send(err);

		if(req.body.name)
			toilet.name = req.body.name;

		if(req.body.address)
			toilet.address = req.body.address;

		if(req.body.details)
			toilet.details = req.body.details;

		toilet.updated = Date.now();

		//Adding hours to the toilet
		if(req.body.open_time)
			toilet.hours[0].open_time = req.body.open_time;

		if(req.body.open_time)
			toilet.hours[0].close_time = req.body.close_time;

		//Adding images to the toilet
		if(req.body.image_url){
			var image = {
				url: req.body.image_url
			}

			toilet.images.push(image);
		}		

		if(req.body.rating || req.body.comment){
			var rating = {
				userId : req.user._id,
				comment : req.body.comment,
				rating : parseInt(req.body.rating)
			}

			toilet.ratings.push(rating);
				//Updating overall_rating
			var sum=0, no_of_ratings=0;
			for(user_rating in toilet.ratings){
				if(toilet.ratings[user_rating].rating > 0){
					sum += parseInt(toilet.ratings[user_rating].rating);
					no_of_ratings++;					
				}
			}
			console.log(sum+" "+no_of_ratings);
			toilet.overall_rating = (sum/no_of_ratings).toFixed(1);
		}

		//Adding users who edited the document
		var edited_by = {
			userId : req.user._id,
			time : Date.now()
		}

		if(edited_by){
			toilet.edited_by.push(edited_by);
		}

		//Save the model and check for errors
		toilet.save(function(err){
			if(err)
				res.send(err);

			res.json(toilet);
		});
	});
}

//Create endpoint for /api/toilets/:toilet_id DELETE requests
exports.deleteToilet = function(req, res){
	//Use Toilet model to find and delete a specific toilet
	Toilet.findByIdAndRemove(req.params.toilet_id, function(err){
		if(err)
			res.send(err);

		res.json({message: "Toilet removed from the database"});
	});
}


