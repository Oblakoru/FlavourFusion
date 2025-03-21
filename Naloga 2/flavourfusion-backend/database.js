const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("flavourfusion.db", (err) => {
  if (err) console.error(err.message);
  else console.log("Povezan na SQLite bazo.");
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      ingredients TEXT NOT NULL,
      instructions TEXT NOT NULL,
      dietary TEXT
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS shopping_list (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
  )`);
});

module.exports = db;