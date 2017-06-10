// Dependencies:
var request = require("request");
var cheerio = require("cheerio");
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

//Express
var app = express();

// Port #
var port = 8080;

// Set Handlebars as the default template
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));

// Body-Parser config
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

//Server Listener
app.listen(port, function(error){
  if (error){
    console.log(error);
  } else {
    console.log("Listening on port: " + port);
  };
});

// #### WebScraping ####
var stories = [];

// Webscraping from Reddit's "Not the Onion"
request("https://www.reddit.com/r/nottheonion", function(error, response, html) {
  var $ = cheerio.load(html);
  stories = [];
  
  $("p.title").each(function(i, element) {
    var onionTitle = $(this).text();
    var link = $(element).children().attr("href");

    stories.push({
      title: onionTitle,
      link: link
    });

  });
});

// #### Routes ####
app.get("/", function(request, response){
  response.render("index", {stories: stories});
});

app.get("/articles/:id", function(request, response){
  response.send("Page here");
});