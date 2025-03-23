const express = require("express");
const db = require("../database");
const bcrypt = require("bcrypt"); // Za varno shranjevanje gesel
const router = express.Router();

// Registracija uporabnika
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Uporabniško ime in geslo sta obvezna." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); 

    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashedPassword],
      function (err) {
        if (err) return res.status(500).json({ error: "Uporabniško ime že obstaja." });
        res.json({ message: "✅ Uporabnik uspešno registriran." });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Napaka pri registraciji." });
  }
});

// Prijava uporabnika
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Uporabniško ime in geslo sta obvezna." });
  }

  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (err) return res.status(500).json({ error: "Napaka pri preverjanju uporabnika." });
    if (!user) return res.status(401).json({ error: "Neveljavno uporabniško ime ali geslo." });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: "Neveljavno uporabniško ime ali geslo." });

    res.json({ message: "✅ Prijava uspešna!", user: { id: user.id, username: user.username } });
  });
});

module.exports = router;