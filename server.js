// Dependencies:
var request = require("request");
var cheerio = require("cheerio");


// Webscraping from Reddit's "Not the Onion"
request("https://www.reddit.com/r/nottheonion", function(error, response, html) {
  var $ = cheerio.load(html);
  var result = [];

  $("p.title").each(function(i, element) {
    var onionTitle = $(this).text();
    var link = $(element).children().attr("href");

    result.push({
      title: onionTitle,
      link: link
    });

  });
  console.log(result);
});