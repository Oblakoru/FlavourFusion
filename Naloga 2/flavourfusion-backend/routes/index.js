var express = require('express');
var router = express.Router();
const db = require("../database");


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/reset_db", (req, res) => {
  db.serialize(() => {
      db.run("PRAGMA foreign_keys = OFF;");
      db.run("DELETE FROM recipes;");
      db.run("DELETE FROM shopping_list;");
      db.run("DELETE FROM users;");
      db.run("PRAGMA foreign_keys = ON;"); 
  });

  res.json({ message: "Database reset successful" });
});


module.exports = router;
