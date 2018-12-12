var mongoose = require("mongoose");

var user_trip = new mongoose.Schema({
    user_id:String,
    trip_id:String
});

var user_trip = module.exports = mongoose.model('user_trip',user_trip);