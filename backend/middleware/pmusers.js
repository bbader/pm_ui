

var database    = require('./database.js');
var sqlData     = require("../models/onestop");

exports.PMUsers = function(req, res, next) {
  database.simpleExecute(
    "select sp.logonid, sp.longname, v.osuser, v.terminal from SECPRINCIPAL sp, V$SESSION v " + 
    "where program like '%vwnt%' AND upper(logonid) = SUBSTR(v.username, 1, LENGTH(v.username) - 2) ",
{},
{
    outFormat: database.OBJECT
})
.then( results => {
    // console.log(results);
    sqlData.sqlResult = results;
    next();
})
.catch( err => {
    next(err);
});
}

