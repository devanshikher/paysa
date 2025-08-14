const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-here";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expect 'Bearer <token>'

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId; // make userId available to routes
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = authenticateToken;
