module.exports = {
  // secret key for jwt signing and encryption
  'secret': process.env.JWT_SECRET,
  // db connection info
  'database': process.env.MONGODB_CONNECTION,
  // port for server
  'port': process.env.PORT || 3000,

  // fb sdk credentials
  'fb': {
    'appID' : process.env.FACEBOOK_APP_ID,
    'appSecret' : process.env.FACEBOOK_APP_SECRET
  }
};
