var crypto = require('crypto')
var config = require('./config')
module.exports = function (pwd){
  pwd = pwd+config.salt
  return  crypto.createHash('sha256').update(pwd).digest('base64');
}