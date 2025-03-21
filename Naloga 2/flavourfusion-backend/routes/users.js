const express = require("express");
const db = require("../database");
const router = express.Router();

// Registracija uporabnika
router.post("/register", (req, res) => {
  const { username, password } = req.body;
  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password],
    function (err) {
      if (err) return res.status(500).json({ error: "Uporabniško ime že obstaja." });
      res.json({ message: "Uporabnik uspešno registriran." });
    }
  );
});

module.exports = router;