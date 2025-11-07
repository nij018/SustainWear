const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/jwt");
const db = require("../config/db");

// VERIFY USER TOKEN
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ errMessage: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);

    const checkUserQuery = "SELECT is_active FROM USER WHERE user_id = ?";
    db.get(checkUserQuery, [decoded.id], (err, user) => {
      if (err) {
        return res.status(500).json({ errMessage: "Database error" });
      }
      if (!user || user.is_active === 0) {
        return res.status(403).json({
          errMessage: "Your account has been deactivated. Please contact support.",
        });
      }

      req.user = decoded;
      next();
    });
  } catch (err) {
    return res.status(403).json({ errMessage: "Invalid or expired token" });
  }
}

// VEIRFY TEMP RESET PASSWORD TOKEN
function verifyResetToken(req, res) {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, jwtSecret);
    res.status(200).json({ valid: true, userId: decoded.id });
  } catch (err) {
    res.status(400).json({ errMessage: "Invalid or expired token" });
  }
}

module.exports = { 
  verifyToken,
  verifyResetToken,
};