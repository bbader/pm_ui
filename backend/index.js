


var express         = require("express"),
app                 = express(),
expressSanitizer    = require("express-sanitizer"),
bodyParser          = require("body-parser"),
flash               = require("connect-flash"),
methodOverride      = require('method-override');
//var oracledb = require('oracledb');
var dbConfig = require('./public/dbconfig.js');
var database = require('./middleware/database.js');


var PORT = process.env.PORT || 3000;

//requiring routes
var onestopRoutes    = require("./routes/onestopRoutes"),
    utilitiesRoutes  = require("./routes/utilitiesRoutes");


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(expressSanitizer());
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Routes
app.get("/", function(req, res){
    res.render("index");
});


app.use("/utilities/onestop", onestopRoutes);

app.use("/utilities", utilitiesRoutes);



database.createPool(dbConfig)
    .then(function() {
        app.listen(PORT, function(){
            console.log("The Server Has Started!");
        });
    })
    .catch(function(err) {
        console.error('Error occurred creating database connection pool', err);
        console.log('Exiting process');
        process.exit(0);
    });
 
