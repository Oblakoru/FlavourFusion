const express = require("express");
const db = require("../database");
const router = express.Router();

// Dodaj v nakupovalni seznam
router.post("/", (req, res) => {
  const { item } = req.body;
  db.run("INSERT INTO shopping_list (item) VALUES (?)", [item], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, item });
  });
});

// Pridobi nakupovalni seznam
router.get("/", (req, res) => {
  db.all("SELECT * FROM shopping_list", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;