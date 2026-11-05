const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set in .env");
  return secret;
};

const signToken = (user) =>
  jwt.sign({ id: user._id.toString(), role: user.role }, getSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// Requires a valid "Authorization: Bearer <token>" header.
const protect = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Not signed in" });
  }

  try {
    const payload = jwt.verify(token, getSecret());
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ message: "Account no longer exists" });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Session expired, please sign in again" });
  }
};

// Use after `protect`: allowRoles("admin") or allowRoles("host", "admin").
const allowRoles =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You don't have access to this" });
    }
    next();
  };

module.exports = { signToken, protect, allowRoles };
