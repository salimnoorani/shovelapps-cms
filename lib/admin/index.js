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

var express = require("express"),
  join = require("path").join,
  editor = require("./editables"),
  debug = require("debug")("cms:admin"),
  plugins = require("./plugins"),
  themes = require("./themes"),
  apps = require("./apps");

module.exports = admin;


/**
 * Creates route for admin panel home and browser client codee
 *
 * @param {express.App} express request handler
 */
function admin(app) {
  // Load admin modules

  plugins(app);
  themes(app);
  apps(app);
  editor(app);
  app.get("/admin", function(req, res, next) {
    adminHome(req, res, next, app);
  });

  ///////
  // Rutas a archivos estaticos sin implementar
  // Pato
  ///////

  app.get("/admin/create-app", function(req, res, next) {
    res.render("../admin/create-app");
  });
  app.get("/admin/app-preview", function(req, res, next) {
    res.render("../admin/app-preview");
  });
  app.get("/admin/settings-app", function(req, res, next) {
    res.render("../admin/settings");
  });


  ///////////////////
  // Serve browser client shovelapps-cms.js 
  app.use("/shovelapps", express.static(join(__dirname, "client/shovelapps")));




}
/**
 * Middleware for serving admin panel's home
 *
 * @param {express.Request} express Request object.
 * @param {express.Response} express Response object.
 * @param {Function} express next() function.
 * @param {express.App} express request handler.
 */
function adminHome(req, res, next, app) {
  res.render("../admin/admin-home", {
    plugins: app.locals.plugins
  });

}