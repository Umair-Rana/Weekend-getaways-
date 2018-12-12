var mongoose = require("mongoose");

var location = new mongoose.Scheema({
	loc_name: {type: String, required: boolean},
	touristPoints: [String],
	review: [reviewSchema]
});

var Location = module.exports = mongoose.model('Location',location);