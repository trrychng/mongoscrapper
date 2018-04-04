var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");
var app = express();
var MONGODB_URI = process.env.MONGODB_URI;

//Desginate our public folder as a static directory
app.use(express.static(__dirname + '/public'));

//Requiring handelbars
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Require all models
var db = require("./models");

var PORT = 3000;

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect( MONGODB_URI || "mongodb://localhost/mongoScrapper", {
  useMongoClient: true
});

// Requiring our routes
require("./routes/scrape.js")(app);


// Start the server
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});