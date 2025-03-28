const express = require("express");
const db = require("../database");
const router = express.Router();
const { authenticateToken, isAdmin } = require("../middleware/auth");


// Iskanje receptov po sestavinah
router.get("/search", (req, res) => {

  console.log("✅ Route /recipes/search was hit!");
  
  const { ingredients } = req.query;

  if (!ingredients || ingredients.trim() === "") {
    return res.status(400).json({ error: "No ingredient provided" });
  }

  const ingredient = ingredients.trim().toLowerCase();

  const sql = `SELECT * FROM recipes WHERE LOWER(ingredients) LIKE ?`;
  const values = [`%${ingredient}%`];

  console.log("🔎 Running Query:", sql, "With Values:", values); 

  db.all(sql, values, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });

    console.log("🔍 Found Recipes:", rows);
    res.json(rows);
  });
});


// Pridobi vse recepte
router.get("/", (req, res) => {
  db.all("SELECT * FROM recipes", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Pridobi recept po ID-ju
router.get("/:id", (req, res) => {
  if (!req.params.id) return res.status(400).json({ error: "Ni podanega ID-ja" });
  db.get("SELECT * FROM recipes WHERE id = ?", req.params.id, (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });

});

// Dodaj recept
router.post("/", authenticateToken, (req, res) => {
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
router.delete("/:id", authenticateToken, (req, res) => {
  db.run("DELETE FROM recipes WHERE id = ?", req.params.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deletedID: req.params.id });
  });
});

module.exports = router;