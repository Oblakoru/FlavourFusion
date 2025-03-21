const express = require("express");
const db = require("../database");
const router = express.Router();

// Pridobi vse recepte
router.get("/", (req, res) => {
  db.all("SELECT * FROM recipes", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Iskanje receptov po sestavinah
router.get("/search", (req, res) => {
  const { ingredients } = req.query;
  db.all(
    "SELECT * FROM recipes WHERE ingredients LIKE ?",
    [`%${ingredients}%`],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Dodaj recept
router.post("/", (req, res) => {
  const { name, ingredients, instructions, dietary } = req.body;
  db.run(
    "INSERT INTO recipes (name, ingredients, instructions, dietary) VALUES (?, ?, ?, ?)",
    [name, ingredients, instructions, dietary],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// Izbriši recept
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM recipes WHERE id = ?", req.params.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deletedID: req.params.id });
  });
});

module.exports = router;