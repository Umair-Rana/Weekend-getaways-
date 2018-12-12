var mongoose = require("mongoose");

var user = mongoose.Schema({
	firstname: {type: String, required: true},
	lastname: {type:String, required: true},
	cell_no:{type:String},
	email: {type:String,required:true, unique: true },
	password: {type:String,required:true},
	date: {type:String},
	path:String
});


var User = module.exports = mongoose.model('User',user);