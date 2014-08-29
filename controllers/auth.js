//Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var User = require('../models/user');
var Client = require('../models/client');
var AccessToken = require('../models/accessToken');
var RefreshToken = require('../models/refreshToken');

passport.use(new BasicStrategy(
	function(username, password, callback){
		User.findOne({ username:username }, function(err, user){
			if(err)
				return callback(err);

			//No user found with that username
			if(!user){
				return callback(null, false);
			}

			user.verifyPassword(password, function(err, isMatch){
				if(err)
					return callback(err);

				//Password didn't match
				if(!isMatch)
					return callback(null, false);

				//Success
				return callback(null, user);

			});
		});
	}
));

passport.use(new ClientPasswordStrategy(function(clientId, clientSecret, done){
		Client.findOne({clientId: username}, function(err, client){
			if(err)
				return done(err);
			if(!client)
				return done(null, false);
			if(client.secret != clientSecret)
				return done(null, flase);

			return done(null, client);
		});
	}
));

passport.use(new BearerStrategy(function(accessToken, done){
	AccessToken.findOne({token: accessToken}, function(err, token){
		if(err)
			return done(null, false);
		if(!token)
			return done(null, false);

		if(Math.round((Date.now() - token.created)/1000) > 3600){
			AccessToken.remove({token: accessToken}, function(err){
				if(err)
					return done(err);
				return done(null, false, {message: 'Token Expired'});
			});
		}

		User.findById(token.userId, function(err, user){
			if(err)
				return done(err);
			if(!user)
				return done(null, false, {message: 'Unknown user'});

			done(null, user, {scope: '*'});
		});
	});
	}
));
//Authorisation using basic and bearer Strategy
exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], {session : false});