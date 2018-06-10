var jwt = require('jsonwebtoken');
var config = require("../public/dbconfig");

function auth(role) {
  return function (req, res, next) {
    var token;
    var payload;

    if ('OPTIONS' == req.method) 
      return res.sendStatus(204);

    if (!req.headers.authorization) {
      return res.status(401).send({
        message: 'You are not authorized (1)'
      });
    }

    // token = req.headers.authorization.split(' ')[1];
    token = req.headers.authorization;

    try {
      payload = jwt.verify(token, config.jwtSecretKey);
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        res.status(401).send({
          message: 'Token Expired'
        });
      } else {
        res.status(401).send({
          message: 'Authentication failed'
        });
      }
      return;
    }
    if (!role || role === payload.role) {
      //pass some user details through in case they are needed
      req.user = {
        name: payload.sub,
        role: payload.role
      };

      next();
    } else {
      res.status(401).send({
        message: 'You are not authorized (2)'
      });
    }
  }
}

module.exports = auth;