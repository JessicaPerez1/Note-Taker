// Dependencies========================
var express = require("express");
var path = require("path");
const { fstat } = require("fs");

// Sets up the Express App========================
var app = express();
//set up dynamic port for HEROKU
var PORT = process.env.PORT || 3000;

//GET /api/notes - should read the db json file and return all saved notes as JSON
app.get("/api/notes", function (req, res) {
  fs.readFile(".db//db.json", function (err, data) {
    var note = JSON.parse(data);
    res.json(note);
  });
});
//POST /api/notes = should receive a new note to save on the req body
//add it to the db json file, then return new note to user
app.post("/api/notes", function (req, res) {
  fs.writeFile("./db/db.json", function (err, data) {
    var note = JSON.parse(data);
    res.json(note);
  });
});

//DELETE ===============NOT DONE
app.delete("/api/notes/:id", function (req, res) {
  var note = req.params.id;
});
// Sets up the Express app to handle data parsing========================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//piece of middleware built into Express, finds and returns the static file requested.
//pass the name of the directory we want Express to serve files from
app.use(express.static("./public"));

//Require route file========================
require("./routes/htmlroutes")(app);
require("./routes/apiroutes")(app);

// Starts the server to begin listening========================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});

//should receive a new note
//function to save a note from db
//get the note data from the inputs and save it to the db and update
