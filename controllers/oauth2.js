//Load required packages
var oauth2orize = require('oauth2orize');
var User = require('../models/user');
var crypto = require('crypto');
var Client = require('../models/client');
var passport = require('passport');
var AccessToken = require('../models/accessToken');
var RefreshToken = require('../models/refreshToken');

//Create Oauth2.0 server
var server = oauth2orize.createServer();

//Generic error handler
var errFn = function(cb, err){
	if(err)
		return cb(err);
};	

//Function to destroy any old tokens and generate new access and refresh tokens
var generateTokens = function(modelData, done){
	var errorHandler = errFn.bind(undefined, done);
	var refreshToken, refreshTokenValue, token, tokenValue;

	RefreshToken.remove(modelData, errorHandler);
	AccessToken.remove(modelData, errorHandler);

	tokenValue = crypto.randomBytes(32).toString('base64');
	refreshTokenValue = crypto.randomBytes(32).toString('base64');

	modelData.token = tokenValue;
	token = new AccessToken(modelData);

	modelData.token = refreshTokenValue;
	refreshToken = new RefreshToken(modelData);

	refreshToken.save(errorHandler);
	token.save(function(err){
		if(err)
			return done(err);
		done(null, tokenValue, refreshTokenValue, {'expires_in': 3600});
	});	
};

//Exchange username and password for accessToken
server.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done){
	User.findOne({username: username}, function (err, user) {
		if (err)
			return done(err)
		if(!user){
			return done(null, false);
		}
		user.verifyPassword(password, function(err, isMatch){
			if (err)
				return done(err);
			if(!isMatch)
				return done(null, false);
		});

		var modelData = {userId: user._id, clientId: client.id };

		generateTokens(modelData);
	});
}));

//Exchange refreshToken for accessToken
server.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done){
	RefreshToken.findOne({token: refreshToken, clientId: client.id}, function(err, token){
		if(err)
			return done(err);
		if(!token)
			return done(null, false);

		User.findById(token.userId, function(err, user){
			if(err)
				return done(err);
			if(!user)
				return done(null, false);

			var modelData = {userId: user._id, clientId: client.id};

			generateTokens(modelData, done);
		});
	});
}));

//token endpoint

/*
'token' middleware handles client requests to exchange authorization grants
for access tokens. Based on the grant type being exchanged, the above exchange
middleware will be invoked to handle the request. Clients must authenticate when
making requests
*/

exports.token = [
	passport.authenticate(['basic', 'oauth2-client-password'], {session: false}), 
	server.token(),
	server.errorHandler()
];

