//YelpCamp V10
var express 		= require('express'),
	app 			= express(),
	bodyParser 		= require("body-parser"),
	mongoose 		= require("mongoose"),
	passport		= require("passport"),
	localStrategy	= require("passport-local"),
	methodOverride	= require("method-override"),
	Campground		= require("./models/campground"),
	Comment 		= require("./models/comment"),
	User			= require("./models/user"),
	seedDB			= require("./seeds");

var commentRoutes 		= require("./routes/comments"), 
	campgroundRoutes 	= require("./routes/campgrounds"),
	indexRoutes 		= require("./routes/index");

var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v12"
//mongoose.connect("mongodb://localhost/yelp_camp_v12");
mongoose.connect(url);
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
//seedDB(); //seed the database

//Passport configuration
app.use(require("express-session")({
	secret: "Durham",
	resave: false, 
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

app.use(indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
//app.listen(1337, function(){
	console.log("yelpcamp v12 server started");
});