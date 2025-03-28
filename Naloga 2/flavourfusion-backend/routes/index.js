var express = require('express');
var router = express.Router();
const db = require("../database");
const { authenticateToken, isAdmin } = require("../middleware/auth");

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/reset_db", authenticateToken, isAdmin, (req, res) => {
  db.serialize(() => {
      db.run("PRAGMA foreign_keys = OFF;");
      db.run("DELETE FROM recipes;");
      db.run("DELETE FROM shopping_list;");
      db.run("DELETE FROM users;");
      db.run("DELETE FROM sqlite_sequence WHERE name IN ('recipes', 'shopping_list', 'users');");
      db.run("PRAGMA foreign_keys = ON;"); 
  });

  res.json({ message: "Baza je bila uspešno ponastavljena!" });
});


module.exports = router;
