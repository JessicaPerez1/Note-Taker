// Dependencies========================
var express = require("express");
var path = require("path");
const fs = require("fs");
const { uuid } = require("uuidv4");
//to use promisify
// const util = require("util");

// Sets up the Express App========================
var app = express();
//set up dynamic port for HEROKU
var PORT = process.env.PORT || 3000;
//piece of middleware built into Express, finds and returns the static file requested.

// Sets up the Express app to handle data parsing========================
//pass the name of the directory we want Express to serve files from
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Require route file========================
// require("./")(app);
// require("./")(app);

//GET /api/notes - should read the db json file and return all saved notes as JSON
//get index page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
//get notes page
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

//POST /api/notes = should receive a new note to save on the req body
//add it to the db json file, then return new note to user
app.get("/api/notes", function (req, res) {
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    // include error
    if (err) throw err;
    // var notes = JSON.parse(data);
    var notes = JSON.parse(data);
    res.json(notes);
  });
});
app.post("/api/notes", function (req, res) {
  // req.body
  let notes = fs.readFile("./db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    notes = JSON.parse(notes);
    req.body.id = uuidv4();
    notes.push(req.body);
  });
  //pass into an array
  fs.writeFile("./db/db.json", JSON.stringify(notes), function (err, data) {
    // include error
    if (err) throw err;
    var notes = JSON.parse(data);
    res.json(notes[notes.length - 1]);
  });
});

//DELETE ===============NOT DONE
// app.delete("/api/notes/:id", function (req, res) {
//   var note = req.params.id;
// });

// Starts the server to begin listening========================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});

//should receive a new note
//function to save a note from db
//get the note data from the inputs and save it to the db and update
