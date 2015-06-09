/* #License 
 *
 * The MIT License (MIT)
 *
 * This software consists of voluntary contributions made by many
 * individuals. For exact contribution history, see the revision history
 * available at https://github.com/shovelapps/shovelapps-cms
 *
 * The following license applies to all parts of this software except as
 * documented below:
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * All files located in the node_modules and external directories are
 * externally maintained libraries used by this software which have their
 * own licenses; we recommend you read them, as their terms may differ from
 * the terms above.
 *
 * Copyright (c) 2014-2015 Shovel apps, Inc. All rights reserved.
 * (info@shovelapps.com) / www.shovelapps.com / www.shovelapps.org
 */

var bcrypt = require("bcryptjs"),
  debug = require("debug")("cms:users"),
  config = require("config").get("session");


module.exports = dbusers;

function dbusers(users) {
  //var users = db.get("users");

  users.login = function(username, password, cb) {
    if (!username || !password) {
      return cb(new Error("username or password blank"));
    }

    debug("Finding user %s", username);
    users.findOne({
      username: username,
      password: hash(password)
    }, function whenQueryBack(err, user) {
      if (err) {
        debug("user query failed");
        return cb(new Error("user query failed"));
      }
      if (!user) {
        debug("User not found");
        return cb(new Error("user not found"));
      }
      debug(user);
      cb(null, userProfile(user));
    });
  };

  users.register = function(username, password, cb)
  {
    var userData = {
      username : username,
      password : hash(password)
    };

    users.insert(userData, function(err, user)
    {
      if(err)
        return cb(err); 

      debug("User %s created", user.username);
      return cb(null, userProfile(user));
    });
  };

  function userProfile(user) {
    return user;
  }

  function hash(password) {
    var _hash = bcrypt.hashSync(password, config.salt);
    return _hash;
  }
  return users;
}