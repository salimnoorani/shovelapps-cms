/**
* Prueba de concepto para el alta de la aplicacion desde shovelapps.com
* Al dar de alta una aplicacion desde shovel.com se realiza un POST al
* endpoint /register/app de la instancia asignada con username, password 
* y appId. El endpoint una vez recibidos los datos realiza una consulta a
* la DB de shovel.com para validar los mismos, en caso favorable
* elimina todos los users de la db local y crea uno nuevo con los datos 
* recividos.
*
* @TODO: El endpoint /register/app deberia utilizar authorization basic 
* @TODO: La DB de shovel.com deberia tener credenciales para que no quede expuesta?
* @TODO: No solo se deberian limpiar los users si no todas las DB de el cms.
*
* NOTA:
* NeDB no borra nada de los files, va haciendo appends, o sea que se eliminen
* todos los registros van a quedar en el .db como $deleted, teniendo en cuenta
* que nos vamos a pasar a mongo no deberia importar al menos por ahora.
*
* NOTA:
* La forma de encriptar el password es diferente entre el cms y el .com podriamos 
* usar el mismo metodo.
*/

/**
* INITIALIZER CONFIG
* 
*  "initializer":
*  {
*    "mongoUrl": "mongodb://localhost:27017/shovelapps-development",
*    "encrypter": {
*      "key": "keystring",
*      "algorithm": "aes256"
*    },
*    "defaultUser":
*    {
*      "username" : "admin",
*      "password" : "admin"
*    }
*  }
*/


var debug     = require("debug")("cms:initializer");
var users     = require("../db").users;
var Remote    = require("./remote");
var encrypter = require("./encrypter");
var config    = require("config").get("initializer");

module.exports = function(app, options)
{
  var remote = new Remote();

  app.post("/register/app", function(req, res, next)
  {    
    debug(req.body);

    var username = req.body.username;
    var password = req.body.password;
    var appId    = req.body.appId;

    debug("initializing app for user: %s, app: %s", username,appId );

    remote.validation(username, password, appId, function(err)
    {
      if(err)
        return res.status(500).send(err);

      users.remove({}, {multi : true}, function(err)
      {
        if(err)
          return res.status(500).send('Error while cleaning DB');

        //Desencripto el password para pasarlo por bcrypt.hashSync en el alta del nuevo user
        users.register(username, encrypter.decrypt(password), function(err, user)
        {
          if(err)
            return res.status(500).send('Error while creating new user');        

          debug("Usuario registrado");
          return res.status(200).send("ok");
        });      

      });
    });

  });

  app.post("/unregister/app", function(req, res, next)
  {
    debug(req.body);

    var username = req.body.username;
    var password = encrypter.decrypt(req.body.password);
    var appId    = req.body.appId;

    var defaultUser = config.get('defaultUser');

    debug("removing data from DB for user: %s, app: %s", username,appId );

    remote.validation(username, password, appId, function(err)
    {
      if(err)
        return res.status(500).send(err);

      users.remove({}, {multi : true}, function(err)
      {
        if(err)
          return res.status(500).send('Error while cleaning DB');

        users.register(defaultUser.username, defaultUser.password, function(err, user)
        {
          if(err)
            return res.status(500).send('Error while creating new user');        

          debug("Usuario registrado");
          return res.status(200).send("ok");
        });      

      });
    });

  });

};