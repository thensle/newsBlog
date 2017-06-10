// Dependencies:
var request = require("request");
var cheerio = require("cheerio");
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

//Models
// var Comment = "./models/comments.js";
var Article = "./models/articles.js"; 

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

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/newsStories");

var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// #### Routes ####
app.get("/", function(request, response){
  Article.find({}, function(error, data) {
    if (error) {
      console.log(error);
    }
    else {
     response.render("index", {stories: data});
    }
  });
  
});

app.get("/saved/articles", function(requestServer, response) {
  // Webscraping from Reddit's "Not the Onion"
  request("https://www.reddit.com/r/nottheonion", function(error, response, html) {
    var $ = cheerio.load(html);

    $("p.title").each(function(i, element) {
      var stories = {};
      stories = {
        title: $(this).text(),
        link: $(element).children().attr("href")
      };

      var entry = new Article(stories);

      entry.save(function(err, data) {
        if (err) {
          console.log(err);
        }
        else {
          // console.log(data);
        }
      });

    });
  });
  response.send("Scrape Complete");
});

// JSON of Articles and Associated Comments in db
app.get("/articles", function(request, response) {
  Article.find({}, function(error, data) {
    if (error) {
      console.log(error);
    }
    else {
      response.json(data);
    }
  });
});

// Route to individual article - page to see comments
app.get("/articles/:id", function(request, response) {
  Article.findOne({ "_id": req.params.id })
  .populate("comments")
  .exec(function(error, data) {
    if (error) {
      console.log(error);
    }
    else {
      response.json(data);
    }
  });
});


// Post a comment to a particular article
app.post("/articles/:id", function(request, response) {
  var newComment = new Comment(req.body);

  newComment.save(function(error, data) {
    if (error) {
      console.log(error);
    }
    else {
      Article.findOneAndUpdate({ "_id": req.params.id }, { "comments": doc._id })
      .exec(function(err, data) {
        if (err) {
          console.log(err);
        }
        else {
          response.send(data);
        }
      });
    }
  });
});

//Server Listener
app.listen(port, function(error){
  if (error){
    console.log(error);
  } else {
    console.log("Listening on port: " + port);
  };
});