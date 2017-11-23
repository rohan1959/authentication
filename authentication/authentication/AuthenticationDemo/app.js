    var express           = require("express"),
    mongoose              = require("mongoose"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");
    
    
    mongoose.connect("mongodb://localhost/auth_demo_app");
    mongoose.Promise = global.Promise;
    
    var app = express();
    
    // secret is used to encode and decode data which is to be stored in the database.
    app.use(require("express-session")({
      secret:" Coding is fun", 
      resave: false,
      saveUninitialized:false
    }));
    
    
    app.set("view engine","ejs");
    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({extended: true})); // to use body parser.
    app.use(passport.initialize());
    app.use(passport.session());
    
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    
    // ==============================
    // Routes 
    //===============================
    app.get("/", function(req,res){
       res.render("home"); 
    });
    
    
    app.get("/secret",isLoggedIn, function(req,res){
       res.render("secret");
    });

    //-----------------------------
    // AUth ROutes 
    //-----------------------------
    
    //signup form 
    app.get("/register", function(req, res) {
        res.render("register");
    });
    
    // handling user signin 
    app.post("/register", function(req,res){
        //res.send("Register post route");
        req.body.username;
        req.body.password;
        User.register(new User({username:req.body.username}), req.body.password,function(err,user){
            if(err){
                console.log(err);
                return res.render("register");
                
            }
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secret");
            });
        });
    });
    //Login Routes.
    //render login form. 
    app.get("/login", function(req,res){
       res.render("login"); 
    });
    
    //login logic 
    //middleware - passport.
    app.post("/login",passport.authenticate("local",{
        successRedirect: "/secret",
        failureRedirect: "/login"
    }) ,function(req,res){
    });
    
    
    //logout route.
    app.get("/logout", function(req,res){
        req.logout();
        res.redirect("/");
    })
    
    //midddleware for checking if user is logged in. 
    function isLoggedIn(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect("/login");
    }
    
    app.listen(process.env.PORT, process.env.IP, function(){
        console.log("server started ...");
    });
    
    