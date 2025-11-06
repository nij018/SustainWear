const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/jwt");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ errMessage: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ errMessage: "Invalid or expired token" });
  }
}

module.exports = { verifyToken };