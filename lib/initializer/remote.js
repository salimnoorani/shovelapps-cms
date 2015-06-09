var debug    = require("debug")("cms:initializer:remote");
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var config   = require("config").get("initializer");

var AppSlotSchema = new Schema({
  ObjectId: ObjectId,
  date: {
    type: Date
  },
  url: {
    type: String
  },
  type: {
    type: String
  },
  description: {
    type: String
  }  
});

var userSchema = new Schema({
  ObjectId: ObjectId,
  username: {
    type: String
  },
  password: {
    type: String
  },
  isConfirmed: {
    type: Boolean
  },
  apps: [AppSlotSchema]
});

mongoose.connect(config.get('mongoUrl'));
var remoteUser = mongoose.model('User', userSchema);

var remoteValidation = function(username, password, appId, done)
{
  remoteUser.findOne({email : username}, function(err, user)
  {
    if (err)
      return done(err);
    
    if (!user)
      return done('Invalid credentials');

    if (password !== user.password)
      return done('Invalid credentials');

    if (user.isConfirmed !== true)
      return done('Account activation pending');

    if( !user.apps.id(appId) )
      return done('Invalid app code'); 
    
    return done(null);
  });
};

module.exports = function()
{
  return { validation: remoteValidation };
};
