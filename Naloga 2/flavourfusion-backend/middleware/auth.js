const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

function authenticateToken(req, res, next) {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Dostop zavrnjen! Manjkajoči žeton." });

  jwt.verify(token, ACCESS_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Neveljaven ali potekel žeton!" });
    req.user = user;
    next();
  });
}

// Middleware za preverjanje refresh tokena
function authenticateRefreshToken(req, res, next) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: "Ni osvežitvenega žetona!" });

  jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Neveljaven refresh token!" });
    req.user = user;
    next();
  });
}

function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Dostop zavrnjen! Nimate administratorskih pravic." });
  }
  next();
}

module.exports = { authenticateToken, authenticateRefreshToken, isAdmin };
