//Load required modules
var mongoose = require('mongoose');

//Define Token Schema
var RefreshTokenSchema = new mongoose.Schema({
	userId: {type: String, required: true},
	clientId: {type: String, required: true},
	token: {type: String, unique: true, required: true},
	created: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
