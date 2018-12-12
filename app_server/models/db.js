var mongoose = require('mongoose');
var dbURI='mongodb://localhost/project';
//var dbURI='mongodb://umairrana:umairrana123456789@ds015953.mlab.com:15953/weekend-getaways'

mongoose.connect(dbURI);
mongoose.connection.on('connected',function(){
    console.log('Mongoose connected to' + dbURI);
});

mongoose.connection.on('err',function(err){
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected',function(){
    console.log('Mongoose disconnected');
});

var gracefulShutdown = function(msg, callback){
    mongoose.connection.close(function(){
        console.log('Mongoose disconnected through'+msg);
        callback();
    });
};

mongoose.connection.once('open',function(){
    console.log('Connected to MongoDb');
});

mongoose.connection.on('error',function(err){
    console.log('error');
});
require("./user");
require("./admin");
require("./contact");
require("./Trip");
require("./review");