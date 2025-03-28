const express = require("express");
const db = require("../database");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");

// Dodaj v nakupovalni seznam
router.post("/", authenticateToken, (req, res) => {
  const { item } = req.body;
  db.run("INSERT INTO shopping_list (item) VALUES (?)", [item], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, item });
  });
});

// Pridobi nakupovalni seznam
router.get("/", authenticateToken, (req, res) => {
  db.all("SELECT * FROM shopping_list", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Izbriši iz nakupovalnega seznama
router.delete("/:id", authenticateToken, (req, res) => {
  db.run("DELETE FROM shopping_list WHERE id = ?", req.params.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deletedID: req.params.id });
  });
});

// Posodobi nakupovalni seznam
router.put("/:id", authenticateToken, (req, res) => {
  const { item } = req.body;
  db.run("UPDATE shopping_list SET item = ? WHERE id = ?", [item, req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updatedID: req.params.id, item });
  });
});


module.exports = router;