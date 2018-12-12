var mongoose = require("mongoose");


var blog = new mongoose.Schema({
	blog_name: String,
	postedOn: {type: Date, "default": Date.now},
	postedBy: String,
	loc: String
});


var Blog = module.exports = mongoose.model('Blog',blog);