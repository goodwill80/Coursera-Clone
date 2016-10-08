module.exports= {

  database: 'mongodb://root:password123@ds053216.mlab.com:53216/digiskills',
  port: 2000,
  secretKey: 'hello12345678',
  facebook: {
    clientId: '1110061769115357',
    clientSecret: '5b26a9009b29dbe2b5e0c9d338ba9457',
    profileFields: ['emails', 'displayName'] ,
    callbackURL: 'http://localhost:2000/auth/facebook/callback'
  }

}
