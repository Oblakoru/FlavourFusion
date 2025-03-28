const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

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
      password TEXT NOT NULL,
      role TEXT DEFAULT 'user'
  )`, seedAdminUser);
});


async function seedAdminUser() {
  const adminUsername = "admin";
  const adminPassword = "admin123"; 
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  db.get("SELECT * FROM users WHERE role = 'admin'", [], (err, admin) => {
    
    if (err) {
      console.error("❌ Napaka pri preverjanju admin uporabnika:", err.message);
      return;
    }

    if (!admin) {
      db.run(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        [adminUsername, hashedPassword, "admin"],
        (err) => {
          if (err) console.error("❌ Napaka pri dodajanju admina:", err.message);
          else console.log("✅ Admin uporabnik ustvarjen!");
        }
      );
    } else {
      console.log("✅ Admin uporabnik že obstaja.");
    }
  });
}


module.exports = db;