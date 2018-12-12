var mongoose = require("mongoose");

var admin = mongoose.Schema({
	firstname: {type: String, required: true},
	lastname: {type:String, required: true},
	cell_no:{type:String},
	email: {type:String,required:true, unique: true },
	password: {type:String,required:true}
});

var Admin = module.exports = mongoose.model('Admin',admin);