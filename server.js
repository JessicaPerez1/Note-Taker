// Dependencies========================
var express = require("express");
var path = require("path");
const fs = require("fs");
// Sets up the Express App========================
var app = express();
//set up dynamic port for HEROKU
var PORT = process.env.PORT || 3000;
//piece of middleware built into Express, finds and returns the static file requested.
// const { uuid } = require("uuidv4");
//to use promisify
// const util = require("util");

// Sets up the Express app to handle data parsing========================
//pass the name of the directory we want Express to serve files from
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//POST /api/notes = should receive a new note to save on the req body
//add it to the db json file, then return new note to user
app.get("/api/notes", function (req, res) {
  fs.readFile("./db/db.json", "utf8", function (err, data) {
    if (err) throw err;
    data = JSON.parse(data);
    res.json(data);
  });
});

app.post("/api/notes", function (req, res) {
  // req.body
  fs.readFile("db/db.json", "utf8", function (err, database) {
    if (err) throw err;

    database = JSON.parse(database);
    var newNote = req.body;

    // Proposition: We want each new id to be one greater than the last elements id
    // newNote.id = database.length + 1;
    //If there are no notes, you end up breaking because you can't make a new note id.
    if (database.length === 0) {
      newNote.id = 1;
    } else {
      const lastElementId = database[database.length - 1].id;
      newNote.id = lastElementId + 1;
    }

    database.push(newNote);

    database = JSON.stringify(database);

    fs.writeFile("db/db.json", database, function (err) {
      if (err) throw err;
      res.sendStatus(200);
    });
  });
});

//DELETE ===============NOT DONE
app.delete("/api/notes/:id", function (req, res) {
  const id = parseInt(req.params.id);
  fs.readFile("db/db.json", "utf8", function (err, database) {
    if (err) throw err;

    database = JSON.parse(database);

    //filter keeps everything for which the function in filter returns true.
    var newDatabase = database.filter((note) => {
      return note.id !== id;
    });
    newDatabase = JSON.stringify(newDatabase);
    fs.writeFile("db/db.json", newDatabase, function (err) {
      if (err) throw err;
      res.sendStatus(200);
    });
  });
});

//HTML ROUTES
//GET /api/notes - should read the db json file and return all saved notes as JSON
//get notes page
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});
//get index page
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
// Starts the server to begin listening========================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});

//should receive a new note
//function to save a note from db
//get the note data from the inputs and save it to the db and update
