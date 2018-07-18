'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const logger = require('morgan');
const router = require('./router');
const config = require('./config/main');

global.Promise = require('bluebird');

mongoose.connect(config.database, { useNewUrlParser: true });

const server = app.listen(config.port);
console.log('Server listening on port ' + config.port + '...');

// set up basic middleware
app.use(logger('dev'));

// parse urlencoded bodies to JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// enable cors manually (could use cors middleware as well)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

router(app);
