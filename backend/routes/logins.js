var oracledb = require('oracledb');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var config = require('../public/dbconfig');

function post(req, res, next) {
  oracledb.getConnection(
    config.database,
    function (err, connection) {
      if (err) {
        return next(err);
      }

      connection.execute(
        'select id as "id", ' +
        '   name as "name", ' +
        '   password as "password" ' +
        'from jsao_users ' +
        'where name = :name', {
          name: req.body.name.toLowerCase()
        }, {
          outFormat: oracledb.OBJECT
        },
        function (err, results) {
          var user;

          if (err) {
            connection.release(function (err) {
              if (err) {
                console.error(err.message);
              }
            });

            return next(err);
          }

          user = results.rows[0];

          if (user == null) {
            res.status(401).send({
              message: 'Unknown user name.'
            });
          } else if (user.name == req.body.name.toLowerCase() ) {
            res.status(200).json({
              user: user
            });
          } else {
            res.status(401).send({
              message: 'Invalid name or password.'
            });
          }

          // bcrypt.compare(req.body.password, user.password, function (err, pwMatch) {
          //   var payload;

          //   if (err) {
          //     return next(err);
          //   }

          //   if (!pwMatch) {
          //     res.status(401).send({
          //       message: 'Invalid name or password.'
          //     });
          //     return;
          //   }

          //   payload = {
          //     sub: user.name
          //   };

          //   res.status(200).json({
          //     user: user,
          //     token: jwt.sign(payload, config.jwtSecretKey, {
          //       expiresIn: 60 * 60
          //     })
          //   });
          // });

          connection.release(function (err) {
            if (err) {
              console.error(err.message);
            }
          });
        });
    }
  );
}

module.exports.post = post;