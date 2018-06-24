
var database    = require('./database.js');
var sqlData     = require("../models/onestop");

exports.getCOTableList = function(req, res, next) {
  database.simpleExecute(
    "select CLASS_NAME, DB_TABLE from persist_class where is_custom = 1",
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

exports.truncateCOTableList = function(req, res, next) {
    let sql = "truncate table " + req.body.name ;
    database.simpleExecute(
      sql,
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

