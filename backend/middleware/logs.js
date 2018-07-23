
var DashBdData = require("../models/onestop");
var fs         = require('fs');

exports.getLogFileList = function(req, res, next) {
  let dir = req.body.directory ;
  const files = fs.readdirSync(dir, 'utf8');
  const response = [];
  for (let file of files) {
    let name = dir +"/" + file;
    const stats = fs.statSync(name);
    if(stats.isDirectory() === false ) {
      response.push({ filename: file, stats });  
    }
  }
  DashBdData.logFiles = response;
  next();
}
