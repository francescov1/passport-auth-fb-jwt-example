'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

// ============================ User Schema ============================ //

const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  },
  password: { type: String },
  salt: { type: String },
  profile: {
    firstName: { type: String },
    lastName: { type: String}
  },
  facebook: {
    id: { type: String },
    displayName: { type: String },
    photoUrl: { type: String },
    email: { type: String },
    accessToken: { type: String }
  }
}, {
  timestamps: true
});

// encrypt password before saving
UserSchema.pre('save', function(next) {

  const user = this;

  if (!user.isModified('password'))
    return next();

  user.salt = crypto.randomBytes(16).toString('hex');
  user.password = crypto.pbkdf2Sync(user.password, user.salt, 1000, 64, 'sha512').toString('hex');
  return next();
})

// check password function
UserSchema.methods.validatePassword = function(candidatePassword) {
  var hash = crypto.pbkdf2Sync(candidatePassword, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.password === hash;
}

module.exports = mongoose.model('User', UserSchema);
