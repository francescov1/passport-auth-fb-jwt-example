module.exports = {
  // secret key for jwt signing and encryption
  'secret': 'secret passphrase',
  // db connection info
  'database': 'mongodb://<connection>',
  // port for server
  'port': process.env.PORT || 3000,

  // fb sdk credentials
  'fb': {
    'appID' : '<fb_app_id>',
    'appSecret' : '<fb_app_secret>'
  }
}
