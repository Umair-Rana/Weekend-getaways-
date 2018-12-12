var userSchema = require('../models/user');
var adminSchema = require('../models/admin');
var contactSchema=require('../models/contact');
var tripSchema=require('../models/Trip');
var reviewSchema=require('../models/review');
var userTripSchema=require('../models/user_trip');
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
    if (req.session && req.session.admin){
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
    }
    else
        res.redirect('/login/');
};

module.exports.admin_reviews_delete = function(req, res) {

    if (req.session && req.session.admin){
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
    }
    else
        res.redirect('/login/');
};

module.exports.admin_trip_viewDetails = function(req, res) {
    if (req.session && req.session.admin){
        var str = req.params.tripId;
        query = {_id:str};
        tripSchema.findOne(query,function(err,result){
            if(err) throw err;
            else{
                console.log('deleted');
                res.render("detail_page",
                {
                    output1:result,
                    output:req.params.adminId
                });
            }
        });
    }
    else
        res.redirect('/login/');
};


module.exports.admin_trip_delete = function(req, res) {
    if (req.session && req.session.admin){
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
    }
    else
        res.redirect('/login/');
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
                            req.session.user = user;
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
                    req.session.admin = admin;
                    console.log('Admin found');
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
    //alert( "Handler for .keyup() called." );

    res.render("signup");
    //console.log('oooooooooooooooo');
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
            res.redirect('/signup/');
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
    if (req.session && req.session.admin){
        var str = req.url;
        var id = str.substring(7);
        var query = {_id:id};
        adminSchema.findOne(query,function(err,user){
            if(err) throw err;
            else
                res.render('admin',{output:user.firstname});
        });
    }
    else
        res.redirect('/login/');
};

module.exports.trip = function(req, res,next) {
    
    console.log(req.params.userId);
    console.log(req.params.tripId);
    var today = new Date();
    console.log(today);

    res.render('trip',
        {
            userid:req.params.userId,
            tripid:req.params.tripId,
            //previoustrips:result
        });

    /*userTripSchema.find({user_id:req.params.userId}),function (err,result) {
        if(err)
            console.log("ERROR");
        else{
            result.trip_id = tripSchema.findOne({arrival_date:{$gt: new Date()}},function(err,trip){
                res.render('trip',
                {
                    userid:req.params.userId,
                    tripid:req.params.tripId,
                    previoustrips:trip
                });
            });
        }
    }*/
    /*userTripSchema.find({user_id:req.params.userId},function(err,result)
    {
        res.render('trip',
        {
            userid:req.params.userId,
            tripid:req.params.tripId,
            previoustrips:result
        });
    }*/
    //);
}

module.exports.tripP = function(req, res,next) {
    var Adults = Number(req.body.Adults);
    var Kids = Number(req.body.Kids); 
    var user_id = req.params.userId;
    let trip = new tripSchema();
    trip._id = req.params.tripId;

    userTripSchema.findOne({user_id:user_id,trip_id:trip._id},function(err,result){
        if(err)
            console.log(err);
        else if(!result)
        {
            console.log("1");
            var usertrip_ = new userTripSchema();
            usertrip_.user_id = user_id;
            usertrip_.trip_id = trip._id;
            usertrip_.save(function(err,result){
                if(err)
                {
                    console.log("2");
                    res.render('trip',
                            {
                                userid:req.params.userId,
                                tripid:req.params.tripId,
                                message: "Cant be uploaded"
                            });
                    return;
                }
                else
                {
                    console.log("bhcc");
                }
            });
            tripSchema.findOne({_id:trip._id},function(err,result)
            {
                if(err) 
                    console.log("ERROR");
                trip.seats = result.seats - Adults -Kids;
                if(trip.seats >= 0){
                    tripSchema.updateOne({_id:trip._id},{$set:{seats:trip.seats}},function(err,user){
                        if(err){
                            console.log(err);
                        }
                        else{
                            //alert("Trip Added Successfully");
                            res.render('trip',
                            {
                                userid:req.params.userId,
                                tripid:req.params.tripId,
                                message: "uploaded successfully"
                            });
                        }
                    });
                }
            });
        }
        else{
            res.render('trip',
            {
                userid:req.params.userId,
                tripid:req.params.tripId,
                message: "You have already registered for this trip"
            });
        }
    });
    return;
};

module.exports.signout_user = function(req, res,next) {
    req.session.reset();
    res.redirect('/login/');

}

/*module.exports.add_contact = function(req, res,next) {
    var contact = new contactSchema();
    contact.username = req.body.Name;
    contact.data = req.body.Subject;
    contact.message = req.body.Message;
    contact.email = req.body.Email;

    contact.save(err,result){

    };
}*/

module.exports.user = function(req, res,next) {
    //var str = req.url;
    //var id = str.substring(7);
    if (req.session && req.session.user){
        var id = req.params.userId;
        var query = {_id:id};
        userSchema.findOne(query,function(err,user){
            if(err) console.log("NO");
            else if(user)
            {    
                console.log("NO1");
                tripSchema.find({arrival_date:{$gt: new Date()}},function(err,trips){
                    if(err)
                        console.log("NO2");
                    else{
                        tripSchema.find({arrival_date:{$lt: new Date()}},function(err,result){
                            if(err)
                            console.log("NO3");
                        
                            else if (result){
                                console.log("NO4");
                                res.render('user',
                                {
                                    output:id,
                                    trips:trips,
                                    user:user,
                                    previoustrips:result
                                });
                            }
                            else{
                                console.log("NO5");
                                res.render('user',
                                {
                                    output:id,
                                    trips:trips,
                                    user:user,
                                    previoustrips:"No Previous Trips Yet"
                                });
                            }
                        });    
                    }
                });  
            }
        });
    }
    else{
        res.redirect('/login/');
    }
};

module.exports.admin_user = function(req, res) {
    if (req.session && req.session.admin){
        var str = req.url;
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
    }
    else
        res.redirect('/login/');

};

module.exports.admin_tripsP = function(req, res){
    var trip = new tripSchema();
    
    trip.loc = req.body.location;
    trip.dep_date = req.body.dep;
    trip.arrival_date = req.body.ari;
    trip.Cost = req.body.cost;
    trip.details = req.body.details;
    trip.ROUTE = req.body.route;
    trip.seats = req.body.seats;
    trip.stay_points = req.body.spoint;
    trip.file_name = req.body.finame;
    
    trip.save(function(err,user){
        if(err){
            console.log('Message is sent sussesfully');
        }
        else{
            res.redirect(req.url);
        }
    });
    return;   
}

module.exports.admin_trips = function(req, res){
    var id = req.params.adminId
    res.render('addtrip',{
        output:id
    });
}

module.exports.admin_trip = function(req, res) {
    if (req.session && req.session.admin){
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
    }
    else
        res.redirect('/login/');
};

module.exports.admin_addtrip = function(req,res){
    if (req.session && req.session.admin){
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
    else
        res.redirect('/login/');
}
module.exports.admin_contact = function(req, res) {
    if (req.session && req.session.admin){
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
    }
    else
        res.redirect('/login/');
};

module.exports.admin_review = function(req, res) {
    if (req.session && req.session.admin){
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
    }
    else
        res.redirect('/login/');
};

module.exports.admin_edit = function(req, res) {
    if (req.session && req.session.admin){
        var id = req.params.adminId;
        res.render('admin_edit',{
            output:id
        });
    }
    else
        res.redirect('/login/');
};

module.exports.admin_editP = function(req, res) {
    if (req.session && req.session.admin){
        let admin = {};
        
        if(req.body.firstname.length>0)
            admin.firstname = req.body.firstname;
        
        if(req.body.lastname.length>0)
            admin.lastname = req.body.lastname;
        
        if(req.body.cellnumber.length>0)
            admin.cell_no = req.body.cellnumber;

        if(req.body.email.length>0)
            admin.email = req.body.email;
        
        if(req.body.password.length>0)
            admin.password = req.body.password;
        
        var query = {email:req.session.admin.email};
        adminSchema.updateOne(query,admin,function(err){
            if(err){
                console.log('dsdswWSS');
            }
            else{
                res.redirect('/admin/'+req.session.admin._id);
            }
        });
        return;
    }
    else
       res.redirect('/login/');
};  

module.exports.searchEmail=function(req,res)
{
    console.log('oooooooooooooooo');

    //alert( "Handler for .keyup() called." );
    var _email=req.query.em;//is mein se email wali substring nikal lo
    console.log(_email);
    userSchema.find({ email: _email }).exec(function(err, user) {
        console.log(user);
        if (user.length==0) {
          //user=null;
          var e=null;
          console.log("after setting null"+e);
          res.send(e);
        } 
        else if (err) {
          console.log(err);
    
          return;
        }
        //console.log(user);
        else if(user[0].email==_email){
            console.log('match wali '+user[0].email);
        var e="a";
        res.send(e);
        }
        
        
      });

};

module.exports.searchlog=function(req,res)
{
    var query={email:req.query.em};
    var _code=req.query.pass;

    console.log(query);
    console.log(_code);

    adminSchema.findOne(query,function(err,admin){
        if(err) throw err;
        if(!admin){
            userSchema.findOne(query,function(err,user){
                if(err) throw err;
                if(!user){
                    console.log('NO admin found');
                    res.send('e');
                }
                else if(_code === user.password){
                        console.log('passcode match wala');
                        res.send('t');
                        return;
                }
                else{
                    console.log('ep wala');
                    res.send('ep');
                }
            });
        }
        else if(_code === admin.password){
                res.send('t');
               return;
        }
        else{
            console.log('ep wala');
            res.send('ep');
        }
    });
};

module.exports.sdata=function(req,res)
{
    var _data = req.query.data;
    console.log(_data);
}

module.exports.searchloge=function(req,res)
{
    var query={email:req.query.em};

    //console.log(query);
    //console.log(_code);

    adminSchema.findOne(query,function(err,admin){
        if(err) throw err;
        if(!admin){
            userSchema.findOne(query,function(err,user){
                if(err) throw err;
                if(!user){
                    console.log('NO admin found');
                    res.send('e');
                }
            });
        }
    });
};