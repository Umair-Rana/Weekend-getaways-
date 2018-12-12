var mongoose = require("mongoose");

var review = new mongoose.Schema({
	author: {type: String},
	reviewText: {type:String},
	rating: {type: Number, min: 1, max: 5},
	date: {type: String}

})

var Review = module.exports = mongoose.model('Review',review);