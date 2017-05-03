'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);
  app.use(function(err, req, res, next) {
       console.log('caught it!');
     });
  var port = process.env.PORT || 10010;
  app.listen(port);
});
