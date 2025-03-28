const express = require("express");
const db = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { authenticateToken, authenticateRefreshToken } = require("../middleware/auth");

dotenv.config();
const router = express.Router();

const ACCESS_SECRET = process.env.JWT_SECRET || "your_access_secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your_refresh_secret";

// Shramba refresh tokenov (za demo)
let refreshTokens = [];

// Registracija uporabnika
router.post("/register", async (req, res) => {
  const { username, password, role = "user" } = req.body;  // Privzeta vloga je "user"

  if (!username || !password) {
    return res.status(400).json({ error: "Uporabniško ime in geslo sta obvezna." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, role],
      function (err) {
        if (err) return res.status(500).json({ error: "Uporabniško ime že obstaja." });
        res.json({ message: "✅ Uporabnik uspešno registriran." });
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Napaka pri registraciji." });
  }
});

// Prijava uporabnika & generacija JWT
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

    // 🔥 Dodamo role v JWT
    const payload = { id: user.id, username: user.username, role: user.role };

    // Generiramo access in refresh žeton
    const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });

    refreshTokens.push(refreshToken);
    res.json({ message: "✅ Prijava uspešna!", accessToken, refreshToken });
  });
});

// Refresh access token
router.post("/refresh", authenticateRefreshToken, (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshTokens.includes(refreshToken)) return res.status(403).json({ error: "Neveljaven refresh token!" });

  const newAccessToken = jwt.sign({ id: req.user.id, username: req.user.username }, ACCESS_SECRET, { expiresIn: "15m" });

  res.json({ accessToken: newAccessToken });
});

// Odjava (brisanje refresh tokena)
router.post("/logout", (req, res) => {
  const { refreshToken } = req.body;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.json({ message: "⛔ Odjava uspešna!" });
});

// Zaščitena pot - profil uporabnika
router.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: "Dostop do zaščitenega profila!", user: req.user });
});

module.exports = router;
