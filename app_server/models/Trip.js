var mongoose = require("mongoose");

var trip = new mongoose.Schema({
	loc: String,
	dep_date: Date,
	arrival_date:Date,
	Cost: Number,
	details:String,
	ROUTE:String,
	seats:Number,
	stay_points:[String],
	file_name:String
});

var trip = module.exports = mongoose.model('trip',trip);