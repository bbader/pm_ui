

var fs          = require('fs');
var sqlData     = require("../models/onestop");
var database    = require('./database.js');

exports.JV_DeleteJob = function(req, res, next) {
  // console.log(req.body.job);
  // console.log(req.body.keep_logs);

  if (req.body.keep_logs === true) {
    // console.log("Deleting log files");
    req.body.files.forEach(function(value) {
      if (value) {
        // console.log(value);
        fs.unlink(value, function(error) {
          if (error) {
            console.log('ERROR: File Not Found');
          } else {
            console.log('Deleted ' + value);
          }
          next();
        });
      }
    });  
  }

  let sql = "DELETE FROM pds_job WHERE (job_number = " + req.body.job + " or (job_number = " + req.body.job + " and job_controller_id = 'app_server'))";
  // console.log (sql);
  database.simpleExecute(
    sql,
    {},
    { autoCommit: true, outFormat: database.OBJECT })
    .then( results => {
      sqlData.sqlResult = results;
      next();
    })
    .catch( err => {
      next(err);
    });

  sql = "DELETE FROM pds_notify WHERE job_number = " + req.body.job ;
  // console.log (sql);

  database.simpleExecute(
    sql,
    {},
    { autoCommit: true, outFormat: database.OBJECT })
    .then( results => {
      sqlData.sqlResult = results;
      next();
    })
    .catch( err => {
      next(err);
    });

}