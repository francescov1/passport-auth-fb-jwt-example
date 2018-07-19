'use strict';
const AuthenticationController = require('./controllers/authentication');
const GeneralRoutes = require('./controllers/generalRoutes');
const express = require('express');
const passportService = require('./config/passport');
const passport = require('passport');

// middleware to login
const login = passport.authenticate(['local', 'facebook-token'], { session: false });

// middleware to authenticate requests from previously logged in user
const apiAuth = passport.authenticate('jwt', { session: false });

module.exports = function(app) {

  // auth router
  const authRouter = express.Router();
  authRouter.post('/register', AuthenticationController.register);
  authRouter.post('/login', login, AuthenticationController.login);

  // api router
  const apiRouter = express.Router();
  apiRouter.use('/auth', authRouter);
  // test jwt authentication on api routes (apiAuth middleware should
  // be added to all api routes needing authentication)
  apiRouter.post('/general', apiAuth, GeneralRoutes.route);

  // Set url for API group routes
  app.use('/api', apiRouter);
}
