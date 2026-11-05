const User = require("../models/User");
const { signToken } = require("../middleware/auth");

const SELF_SIGNUP_ROLES = ["guest", "host"];

const authResponse = (user) => ({
  token: signToken(user),
  user: user.toPublicJSON(),
});

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const role = req.body.role || "guest";

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    // Admin accounts are created with `npm run create-admin`, never from the public form.
    if (!SELF_SIGNUP_ROLES.includes(role)) {
      return res.status(400).json({ message: "You can sign up as a guest or a host" });
    }

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({ name, email, password, role });
    res.status(201).json(authResponse(user));
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");

    // Same message for both cases so the form doesn't reveal which emails are registered.
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    res.json(authResponse(user));
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
exports.me = (req, res) => {
  res.json({ user: req.user.toPublicJSON() });
};
