// Dependencies
var mongoose = require("mongoose");

module.exports = function(){
  var Schema = mongoose.Schema;

  var ArticleSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true,
      unique: true
    },
   // In an array, so multiple comments can be associated with each article
    comments: [{
      type: Schema.Types.ObjectId,
      ref: "Comment"
    }]
  });

  var Article = mongoose.model("Article", ArticleSchema);
};

module.exports = Article;