const User = require("../models/User");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "yoursecret";

exports.authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Malformed token" });
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
