//require all necessary modules
var http = require("http");
var express = require("express");
var path = require("path");
var logger = require("morgan");
var bodyParser = require("body-parser");

//create the app
var app = express();

//set the viwing engine
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

//create an array to house the guestbook entries
var entries = [];
app.locals.entries = entries;

//set up morgan
app.use(logger("dev"));

//populates the request.body param if user is submitting a form
app.use(bodyParser.urlencoded({extended: false}));


//define routes

//route for all get root(homepage) requests
app.get("/", function(request, response) {
	response.render("index");
});

//route for get new-entry
app.get("/new-entry", function(request, response) {
	response.render("new-entry");
})

//route for post new-entry
app.post("/new-entry", function(request, response) {
	//checks if form fields are populated
	if(!request.body.title || !request.body.body) {
		response.status(400).send("entries must have a title and body");
		return;	
	}
	//adds the entry to the entries array. Note that this also is available globally through app.locals.entries
	entries.push({
		title: request.body.title,
		content: request.body.body,
		published: new Date()
	});
	//redirects to the root to show the newly aded entry
	response.redirect("/");
})

//sends 404 and dislays 404 page if the request matches none of the above defined routes
app.use(function(request, response) {
	response.status(404).render("404"); 
})

//create server
http.createServer(app).listen(3000, function() {
	console.log("guestbook app started on port 3000");
});



