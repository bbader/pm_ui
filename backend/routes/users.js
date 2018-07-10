var oracledb = require('oracledb');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var config = require('../public/dbconfig');
var database    = require('../middleware/database.js');

function get(req, res, next) {
  database.simpleExecute(
    'select id, fullname, name, role, email, department from jsao_users ',
    {},
    {
        outFormat: database.OBJECT
    })
    .then( results => {
        res.status(200).json({
          results: results,
        });
    })
    .catch( err => {
        next(err);
    });    
}
module.exports.get = get;


function post(req, res, next) {

  if (req.body.type === "delete") {
    deleteUser(req.body.userid, function (err, user) {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        status: 'OK'
      });
    });
  }
  else {
  var user = {
    fullname: req.body.fullname,
    name: req.body.name,
    role: req.body.role,
    email: req.body.email,
    department: req.body.department
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
        '   fullname, ' +
        '   name, ' +
        '   password, ' +
        '   role, ' +
        '   email, ' +
        '   department ' +
        ') ' +
        'values (' +
        '    :fullname, ' +
        '    :name, ' +
        '    :password, ' +
        '    :role, ' +
        '    :email, ' +
        '    :department ' +
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
          role: user.role.toUpperCase(),
          fullname: user.fullname,
          email: user.email,
          department: user.department,
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

function deleteUser(userid, cb) {
  database.simpleExecute(
    'delete from jsao_users where id = ' + parseInt(userid) ,
    {},
    {
      autoCommit: true,
      outFormat: database.OBJECT
    })
    .then( results => {
      cb(null, {
        status: 'OK'
      });
    })
    .catch( err => {
      return cb(err);
    });    
}