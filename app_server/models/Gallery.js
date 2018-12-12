var mongoose = require("mongoose");

var gallery = new mongoose.Schema({
	pic_name: {type: String, required: boolean},
	postedOn: {type:Date, "default": Date.now},
	postedBy: String,
	Loc: [String],
});

var Gallery = module.exports = mongoose.model('Gallery',gallery);