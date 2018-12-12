var adminSchema = require('../models/admin');

module.exports.admin = function(req, res,next) {
    res.render('admin',{output:req.params.id});
};