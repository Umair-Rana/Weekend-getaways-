var mongoose = require("mongoose");

var contact = mongoose.Schema({
	username: {type: String, required: true},
	email: {type:String,required:true },
	message: {type:String, required: true},
	date: {type:String}
});


var Contact = module.exports = mongoose.model('Contact',contact);