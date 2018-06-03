var oracledb = require('oracledb');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var config = require('../public/dbconfig');

function post(req, res, next) {
  var user = {
    name: req.body.name,
    role: req.body.role
  };
  var unhashedPassword = req.body.password;

  bcrypt.genSalt(10, function (err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(unhashedPassword, salt, function (err, hash) {
      if (err) {
        return next(err);
      }

      user.hashedPassword = hash;

      if (req.body.type === "update") {
        updatePassword(user, function (err, user) {
          var payload;
  
          if (err) {
            return next(err);
          }
  
          payload = {
            sub: user.name
          };
  
          res.status(200).json({
            user: user,
            token: jwt.sign(payload, config.jwtSecretKey, {
              expiresIn: 60 * 60
            })
          });
        });
      } else {
        insertUser(user, function (err, user) {
          var payload;
  
          if (err) {
            return next(err);
          }
  
          payload = {
            sub: user.name,
            role: user.role
          };
  
          res.status(200).json({
            user: user,
            token: jwt.sign(payload, config.jwtSecretKey, {
              expiresIn: 60 * 60
            })
          });
        });
      }
    });
  });
}

module.exports.post = post;

function insertUser(user, cb) {
  oracledb.getConnection(
    config.database,
    function (err, connection) {
      if (err) {
        return cb(err);
      }

      connection.execute(
        'insert into jsao_users ( ' +
        '   name, ' +
        '   password, ' +
        '   role ' +
        ') ' +
        'values (' +
        '    :name, ' +
        '    :password, ' +
        '    :role ' +
        ') ' +
        'returning ' +
        '   id, ' +
        '   name, ' +
        '   role ' +
        'into ' +
        '   :rid, ' +
        '   :rname, ' +
        '   :rrole', {
          name: user.name.toLowerCase(),
          password: user.hashedPassword,
          role: user.role,
          rid: {
            type: oracledb.NUMBER,
            dir: oracledb.BIND_OUT
          },
          rname: {
            type: oracledb.STRING,
            dir: oracledb.BIND_OUT
          },
          rrole: {
            type: oracledb.STRING,
            dir: oracledb.BIND_OUT
          }

        }, {
          autoCommit: true
        },
        function (err, results) {
          if (err) {
            connection.release(function (err) {
              if (err) {
                console.error(err.message);
              }
            });

            return cb(err);
          }

          cb(null, {
            id: results.outBinds.rid[0],
            name: results.outBinds.rname[0],
            role: results.outBinds.rrole[0]
          });

          connection.release(function (err) {
            if (err) {
              console.error(err.message);
            }
          });
        });
    }
  );
}

function updatePassword(user, cb) {
  oracledb.getConnection(
    config.database,
    function (err, connection) {
      if (err) {
        return cb(err);
      }

      connection.execute(
        'update jsao_users set password = :password where name = :name', {
          name: user.name.toLowerCase(),
          password: user.hashedPassword
        }, {
          autoCommit: true
        },
        function (err, results) {
          if (err) {
            connection.release(function (err) {
              if (err) {
                console.error(err.message);
              }
            });

            return cb(err);
          }

          cb(null, {
            name: user.name
          });

          connection.release(function (err) {
            if (err) {
              console.error(err.message);
            }
          });
        });
    }
  );
}