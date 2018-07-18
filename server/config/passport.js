'use strict';
const passport = require('passport');
const User = require('../models/user');
const config = require('./main');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const FacebookTokenStrategy = require('passport-facebook-token');

// ============================ Custom Login Strategy ============================ //

const localOptions = { usernameField: 'email' };

const localLogin = new LocalStrategy(localOptions, function(email, password, done) {

  return User.findOne({ email: email })
    .then(user => {
      if(!user)
        return done(null, false, { error: 'Your login details could not be verified. Please try again.' });

      const isValid = user.validatePassword(password);
      if (!isValid)
        return done(null, false, { error: 'Your login details could not be verified. Please try again.' });

      return done(null, user);
    })
    .catch(err => done(err));
});


// ============================ Facebook Token Strategy ============================ //

// fetch fb sdk credentials from fb.js
const fbCredentials = {
  clientID: config.fb.appID,
  clientSecret: config.fb.appSecret
};

const fbLogin = new FacebookTokenStrategy(fbCredentials, function(accessToken, refreshToken, profile, done) {

  // if user is new, save,
  // if user is already in db, return user
	return User.findOne({ 'facebook.id': profile.id })
    .then(existingUser => {
  		if(existingUser)
  			done(null, existingUser);

      let user = new User({
        email: profile.emails[0].value,
        profile: { firstName: profile.name.givenName, lastName: profile.name.familyName },
        facebook: {
          id: profile.id,
          displayName: profile.displayName,
          photoUrl: profile.photos[0].value,
          email: profile.emails[0].value,
          accessToken: accessToken
        }
      });

      return user.save()
    })
    .then(user => done(null, user))
    .catch(err => done(err, false));
});

// ============================ JWT Strategy ============================ //

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secret
};

// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(jwtPayload, done) {

  return User.findById(jwtPayload._id)
    .then(user => {
      if (!user)
        return done(null, false);

      return done(null, user);
    })
    .catch(err => done(err, false))
});

// don't need to export anything, this file just needs to be required from somewhere
passport.use(jwtLogin);
passport.use(localLogin);
passport.use(fbLogin);
