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

var debug = require("debug")("cms:plugin-loader"),
  config = require("config"),
  console = require("better-console"),
  loader = require("require-directory"),
  fs = require('fs'),
  join = require("path").join,
  dirname = require("path").dirname,
  db = require("../../lib/db"),
  pluginsdb = require("../db").plugins,
  extend = require('util')._extend;

module.exports = componentsLoader;

function componentsLoader(app, server, sockets) {
  pluginLoader(app, server, sockets);
}

/**
 * Handles the loading of plugins from the plugins directory.
 *
 * - This module loads the directories inside the plugins directory using require.
 * - Will check if the plugin (module) exports a function that will be called
 *   after the module being require()d.
 * - It will only consider directories that have an index.js file inside and that
 *   index.js is the entry point for the module.
 * - If there's an error in the call to require(), the error is catched and the plugin
 *   is not loaded. The CMS won't crash if an error is thrown by require().
 * - Sets app.locals.plugins with the list of loaded plugins, thus making it
 *   available to the views. Each of the items of the locals.plugins has the
 *   companion package.json for each loaded plugin.
 *   When the plugin is required, this module calls the
 * @param {express.App} app. express request handler.
 * @param {Server} server. HTTP/HTTPS server.
 * @param {Object} sockets. The sockets provided by lib/sockets.
 *   - {io.Manager} ioManager a socket.io manager instance,
 *   - {Socket} platform: client socket to platform builder services,
 *   - {Socket} adminPanel: server socket to adminPanel interface,
 *   - {Socket} frontend: server socket for web frontend
 */

function pluginLoader(app, server, sockets) {
  var plugins;

  var default_api = {
    'getTemplate': function() {}, // da el template para mostrar en la configuracion del mismo, interacciones, etc.
    'saveState': function() {}, // retorna un objeto para guardar su estado actual
    'loadState': function() {}, // carga un estado previo guardado
    'onInit': function() {}, // se ejecuta al ser inicializada una instancia del plugin en el panel de create screen (no necesariamente ya esta a la vista)
    'onShow': function() {}, // se ejecuta cuando es mostrado al usuario en el panel de create screen
    'destroy': function() {}, // se ejecuta cuando se borra una instancia del plugin
    'getHtml': function() {}, // es el html final que generara el plugin
    'getCss': function() {}, // archivo/archivos css para mostrar el html final 
    'getJs': function() {} // archivo/archivos js para mostrar el html final
  };


  try {
    plugins = loader(module, "../../plugins", {
      exclude: /node_modules/,
      include: /index.js$/
    });

  } catch (e) {
    console.error("plugin-loader errored: %s", e.stack);
    debug("plugin-loader errored: %j", e);
    return;
  }
  app.plugins = plugins;
  // Make the plugins list available to the view
  app.locals.plugins = plugins;
  app.locals.pluginsArray = [];
  // Run module.exports if is a function
  // require-directory give it the name index
  for (var k in plugins) {
    //debug("Loaded module %s", k);


    var index = plugins[k].index;
    var pkg = {};
    var defaults = {};
    var api = {};

    try {
      pkg = require('../../plugins/' + k + '/package.json');
    } catch (e) {
      //debug("Plugins package.json not found");
    }
    plugins[k].metadata = pkg;

    try {
      defaults = require('../../plugins/' + k + '/defaults.json');
    } catch (e) {
      //debug("Plugins defaults.json not found");
    }

    try {
      api = require('../../plugins/' + k + '/api.json');
    } catch (e) {
      //debug("Plugins api.json not found, not extending defaults.");
    }
    api = extend(default_api, api);


    app.locals.pluginsArray.push({
      id: k,
      value: k,
      metadata: pkg,
      api: api
    });
    // load into filestorage if not already
    savePlugin(k, defaults);

    if (typeof index === 'function') {
      // The module's module.exports should
      // ways be a function to be called here.
      // Assume it's like an init on the module
      //debug("Calling plugin %s index function (i.e. module.exports=function())", k);
      try {
        plugins[k].index(app, server, sockets);
      } catch (e) {
        debug("Plugin index function errored");
        console.warn("Error trying to load plugin '%s'. The error was: %s", k, e.toString());
        debug(e);
      }
    }
  }
  //addPluginViews(app);
  return plugins;
}
/**
 * Saves the state of a plugin to the DB.
 *
 * @param {String} k. The id/name of a plugin (usually the directory name of the plugin)
 */
function savePlugin(k, config) {
  pluginsdb.find({
    name: k
  }, function(err, docs) {
    var key = k;
    if (docs.length < 1) {
      pluginsdb.insert({
        name: key,
        enabled: 0,
        timestamp: Date.now(),
        config: config
      }, function(err) {
        if (err) {
          debug("I errored loading plugin into db: " + key);
        } else {
          debug("I loaded plugin into db: " + key);
        }
      });
    }
  });
}



function addPluginViews(app) {
  var pluginsBaseDir = join(process.cwd(), "plugins");
  debug("Searching for views in plugins directories");
  var pluginNames = Object.keys(app.plugins),
    pluginsViewPaths = pluginNames.filter(function(pluginName) {
      var dir = join(pluginsBaseDir, pluginName, "views", pluginName);
      if (fs.existsSync(dir)) {
        debug("Views found in plugin directory %s", dir);
        return true;
      } else {
        debug("No views directory found in %s", dir);
        return false;
      }
    }).map(function(pluginName) {
      return join(pluginsBaseDir, pluginName, "views");
    });
  // Set views path
  var viewPaths = app.get("views").concat(pluginsViewPaths);
  debug("Views are being loaded from: \n - %s", viewPaths.join("\n - "));
  app.set("views", viewPaths);

}