var userSchema = require('../models/user');
var adminSchema = require('../models/admin');
var contactSchema=require('../models/contact');
var tripSchema=require('../models/Trip');
var reviewSchema=require('../models/review');
var LocalStrategy = require('passport-local').Strategy;


function getDate()
{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    } 

    if(mm<10) {
        mm = '0'+mm
    } 

    today = mm + '/' + dd + '/' + yyyy;
    return today;
}

function allLetter(inputtxt)
{
    var letters = /^[a-zA-Z ]+$/;
    if(inputtxt.match(letters))
        return true;
    else
        return false;
}

function reverseString(str) {
    // Step 1. Use the split() method to return a new array
    var splitString = str.split(""); // var splitString = "hello".split("");
    // ["h", "e", "l", "l", "o"]
 
    // Step 2. Use the reverse() method to reverse the new created array
    var reverseArray = splitString.reverse(); // var reverseArray = ["h", "e", "l", "l", "o"].reverse();
    // ["o", "l", "l", "e", "h"]
 
    // Step 3. Use the join() method to join all elements of the array into a string
    var joinArray = reverseArray.join(""); // var joinArray = ["o", "l", "l", "e", "h"].join("");
    // "olleh"
    
    //Step 4. Return the reversed string
    return joinArray; // "olleh"
}

module.exports.admin_contact_delete = function(req, res) {
    if (req.session && req.session.user) 
    {
        var str = req.url;
        var len = req.url.length;
        var i =len;
        for(;i>0;i--)
        {
            if(str[i] == '/')
                break;
        }
        var id = str.substring(i+1);
        var query ={_id:id};
        var str1 = reverseString(req.url);
        str1 = str1.substring(len-i);
        str1 = reverseString(str1);
        console.log(str1);
        contactSchema.deleteOne(query,function(err,result){
            if(err) throw err;
            else{
                console.log('deleted');
                res.redirect(str1);
            }
        });
    }else
    res.redirect("/logout/");
};

module.exports.admin_reviews_delete = function(req, res) {
    var str = req.url;
    var len = req.url.length;
    var i =len;
    for(;i>0;i--)
    {
        if(str[i] == '/')
            break;
    }
    var id = str.substring(i+1);
    var query ={_id:id};
    var str1 = reverseString(req.url);
    str1 = str1.substring(len-i);
    str1 = reverseString(str1);
    console.log(str1);
    reviewSchema.deleteOne(query,function(err,result){
        if(err) throw err;
        else{
            console.log('deleted');
            res.redirect(str1);
        }
    });
};

module.exports.admin_trip_delete = function(req, res) {
    var str = req.url;
    var len = req.url.length;
    var i =len;
    for(;i>0;i--)
    {
        if(str[i] == '/')
            break;
    }
    var id = str.substring(i+1);
    var query ={_id:id};
    var str1 = reverseString(req.url);
    str1 = str1.substring(len-i);
    str1 = reverseString(str1);
    console.log(str1);
    tripSchema.deleteOne(query,function(err,result){
        if(err) throw err;
        else{
            console.log('deleted');
            res.redirect(str1);
        }
    });
};

module.exports.home = function(req, res) {
    res.render("home");
};

module.exports.contact = function(req, res) {
    res.render("contact");
};

module.exports.contactP = function(req, res) {
    var contact = new contactSchema();
    if( !allLetter(req.body.firstname) ){
        console.log('MASLA1');
        res.end('problem in user name');
        return;
    }
    if (req.body.email.indexOf('@') <= 0  || req.body.email.indexOf('.') <= 0){
        console.log('MASLA2');
        return;
    }
    if(req.body.message.length< 5){
        console.log('MASLA3')
        return;
    }
    contact.username = req.body.firstname;
    contact.email = req.body.email;
    contact.message = req.body.message;
    contact.date = getDate();
    
    contact.save(function(err,user){
        if(err){
            console.log('Message is sent sussesfully');
        }
        else{
            res.redirect('/contact/');
        }
    });
    return;
};

module.exports.about = function(req, res) {
    res.render("about");
};

module.exports.login = function(req, res) {
    res.render("login");
};

module.exports.loginP = function(req, res){
    var query = {email:req.body.email};
    adminSchema.findOne(query,function(err,admin){
        if(err) throw err;
        if(!admin){
            userSchema.findOne(query,function(err,user){
                if(err) throw err;
                if(!user){
                    console.log('NO admin found');
                    res.render('login',{
                        data : 'Invalid Username or Password'
                    });
                }
                else if(req.body.password === user.password){
                        console.log('User found');
                        res.redirect('/user/'+user._id);
                }
                else{
                    res.render('login',{
                        data : 'Invalid Username or Password'
                    });
                }
            });
        }
        else if(req.body.password === admin.password){
                console.log('Admin found');
                req.session.admin = admin;  
                res.redirect('/admin/'+admin._id);
        }
        else{
            res.render('login',{
                data : 'Invalid Username or Password'
            });
        }
    });
};

module.exports.signup = function(req, res) {
    res.render("signup");
};

module.exports.admin_signout = function(req, res) {
    req.session.reset();
    res.redirect('/login/');
};

module.exports.signupP = function(req, res) {
    var x = 0;
    let user = new userSchema();
    var fn="",ln="",em="",ps="",rps="";
    if( !allLetter(req.body.firstname) ){
        fn = "Does Not Seem A Name";
        x = 1;
    }
    if(!allLetter(req.body.lastname) ){
        ln = "Does Not Seem A Name";
        x = 1;
    }
    if(req.body.password != req.body.re_password){
        rps = "Both Passwords does not match";
        x = 1;
    }
    if(req.body.password.length < 8){
        ps = "Password must have atleast 8 length";
        x = 1;
    }
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.email = req.body.email;
    user.password = req.body.password;
    user.date = getDate();
    user.cell_no = req.body.cell;
    
    user.save(function(err,user){
        if(err){
            console.log('email already exists');
        }
        else{
            res.redirect('/login/');
        }
    });
    return;
};

module.exports.home2 = function(req, res) {
    res.render("home2");
};

module.exports.blog = function(req, res) {
    res.render("blog");
};

module.exports.admin = function(req, res,next) {
    if(req.session && req.session.admin)
    {
        var str = req.url;
        var id = str.substring(7);
        var query = {_id:id};
        adminSchema.findOne(query,function(err,user){
            if(err) throw err;
            else
                res.render('admin',{output:user.firstname});
        });
    }else 
        res.redirect("/login/");
};

module.exports.trip = function(req, res,next) {
    res.render('trip');
}

module.exports.user = function(req, res,next) {
    if(req.session && req.session.admin)
    {
            //var str = req.url;
        //var id = str.substring(7);
        var id = req.params.userId;
        var query = {_id:id};
        userSchema.findOne(query,function(err,user){
            if(err) throw err;
            else
            {        
                tripSchema.find({},function(err,trips){
                    res.render('user',{
                        output:id,
                        trips:trips,
                        user:user
                    });
                });  
            }
        });
    }
};

module.exports.admin_user = function(req, res) {
    if(req.session && req.session.admin)
    {    var str = req.url;
        var id = str.substring(7);
        var id = reverseString(id);
        var id = id.substring(6);
        var id = reverseString(id);
        console.log(id);
        userSchema.find({}).sort({date:-1}).exec(function(err,users){
            res.render('admin_user',{
                output:id,
                users:users
            });
        });  
    }else
        res.redirect("/login/")
};

module.exports.admin_trip = function(req, res) {
    if(req.session && req.session.admin)
    {
        var str = req.url;
        var id = str.substring(7);
        var id = reverseString(id);
        var id = id.substring(8);
        var id = reverseString(id);
        tripSchema.find({},function(err,trips){
            res.render('admin_trip',{
                output:id,
                trips:trips
            });
        });  
    }else
    res.redirect("/login/");
};

module.exports.admin_addtrip = function(req,res){
    let trip = new tripSchema();
    
    trip.Cost = req.body.Cost;
    trip.loc = req.body.loc;
    trip.dep_date = req.body.date;
    trip.dep_time = req.body.time;
    trip.details = req.body.details;
    
    
    trip.save(function(err,user){
        if(err){
            console.log('email already exists');
        }
        else{
            res.redirect(req.url);
        }
    });
    return;
}

module.exports.admin_contact = function(req, res) {
    var str = req.url;
    var id = str.substring(7);
    var id = reverseString(id);
    var id = id.substring(9);
    var id = reverseString(id);
    console.log(id);
    contactSchema.find({}).sort({date:1}).exec(function(err,contacts){
        res.render('admin_contact',{
            output:id,
            contacts:contacts
        });
    });  
};

module.exports.admin_review = function(req, res) {
    var str = req.url;
    var id = str.substring(7);
    var id = reverseString(id);
    var id = id.substring(8);
    var id = reverseString(id);
    console.log(id);
    reviewSchema.find({},function(err,reviews){
        res.render('admin_review',{
            output:id,
            reviews:reviews
        });
    });  
};

module.exports.admin_edit = function(req, res) {
    res.send('yes');
    /*var str = req.url;
    var id = str.substring(7);
    var id = reverseString(id);
    var id = id.substring(5);
    var id = reverseString(id);
    console.log(id);
    var query = {_id:id};
    adminSchema.findOne(query,function(err,user){
        if(err) {
            console.log('123ed');
            throw err;
            res.end();
        }
        else if(!user)
        {
            console.log("Admin not found");
            res.end();
        }
        else{
            res.render('admin_edit',{
                output:id,
                firstname:user.firstname,
                lastname:user.lastname,
                cell_no:user.cell_no,
                email:user.email,
                password:user.password
            });     
        }
    });*/
};

module.exports.admin_editP = function(req, res) {
    let admin = {};
    if( !allLetter(req.body.firstname) ){
        console.log('MASLA1');
        res.end('problem in name');
        return;
    }
    if(!allLetter(req.body.lastname) ){
        console.log('MASLA2');
        return;
    }
    if(isNaN(req.body.cell_no)){
        console.log('MASLA3');
        return;
    }
    if(req.body.cell_no.length != 11){
        console.log('MASLA4');
        return;
    }
    if(req.body.password != req.body.re_password){
        console.log('MASLA5');
        return;
    }
    if(req.body.password.length < 8){
        console.log('MASLA6');
        return;
    }
    if (req.body.email.indexOf('@') <= 0  || req.body.email.indexOf('.') <= 0){
        console.log('MASLA7');
        return;
    }
    admin.firstname = req.body.firstname;
    admin.lastname = req.body.lastname;
    admin.cell_no = req.body.cell_no;
    admin.password = req.body.password;
    
    var str = req.url;
    var id = str.substring(7);
    var id = reverseString(id);
    var id = id.substring(5);
    var id = reverseString(id);
    console.log(id);
    var query = {_id:id};
    adminSchema.update(query,admin,function(err){
        if(err){
            console.log('');
        }
        else{
            res.redirect('/admin/'+id);
        }
    });
    return;
};  