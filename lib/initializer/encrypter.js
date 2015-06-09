var debug  = require("debug")("cms:initializer:encrypter");
var crypto = require('crypto');
var config = require("config").get("initializer");

var algorithm = config.get('encrypter.algorithm');
var key 	  = config.get('encrypter.key');

var encrypt = function encrypt(str)
{
  var cipher = crypto.createCipher(algorithm, key);
  var encrypted = cipher.update(str, 'utf8', 'hex') + cipher.final('hex');
  debug("Encrypted: " + encrypted);
  return encrypted;
};

var decrypt = function decrypt(str)
{
  var decipher = crypto.createDecipher(algorithm, key);
  var decrypted = decipher.update(str, 'hex', 'utf8') + decipher.final('utf8');
  debug("decrypted: " + decrypted);
  return decrypted;
};

module.exports = { decrypt : decrypt, encrypt: encrypt };