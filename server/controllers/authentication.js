'use strict';
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/main');

// generate jwt token with basic user data
function generateTokenResponse(user) {

  // user info to be included in jwt
  const userInfo = {
    _id: user._id,
    firstName: user.profile.firstName,
    lastName: user.profile.lastName,
    email: user.email
  };

  return {
    token: 'JWT ' + jwt.sign(userInfo, config.secret, { expiresIn: 10080}),
    user: userInfo
  };
}

// login route
exports.login = function(req, res, next) {
  return res.status(200).json(generateTokenResponse(req.user));
}

// registration route
exports.register = function(req, res, next) {

  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;

  // check for errors
  if (!email)
    return res.status(422).send({ error: 'You must enter an email address.'});
  if (!firstName || !lastName)
    return res.status(422).send({ error: 'You must enter your full name.'});
  if (!password)
    return res.status(422).send({ error: 'You must enter a password.' });

  return User.findOne({ email: email })
    .then(existingUser => {

      // If user is not unique, return error
      if (existingUser)
        return res.status(422).send({ error: 'That email address is already in use.' });

      // If email is unique and password was provided, create account
      let user = new User({
        email: email,
        password: password,
        profile: { firstName: firstName, lastName: lastName }
      });

      return user.save()
    })
    .then(user => {

      // respond with jwt
      res.status(201).json(generateTokenResponse(user));
    })
    .catch(err => next(err));
}
