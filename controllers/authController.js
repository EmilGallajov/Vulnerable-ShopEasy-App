const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_jwt_secret_key"; // In production, use env variable
const JWT_COOKIE = "jwt";

exports.showLogin = (req, res) => {
  res.render("login", { error: null });
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  const user = userModel.getUserByUsername(username);
  if (user && user.password === password) {
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "2h" });
    res.cookie(JWT_COOKIE, token, { httpOnly: true });
    res.redirect("/orders");
  } else {
    res.render("login", { error: "Invalid username or password" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie(JWT_COOKIE);
  res.redirect("/login");
};

exports.sessionMiddleware = (req, res, next) => {
  const token = req.cookies[JWT_COOKIE];
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
    } catch (err) {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
};

exports.requireAuth = (req, res, next) => {
  if (!req.user) return res.redirect("/login");
  next();
};

exports.profile = (req, res) => {
  const requestedId = parseInt(req.params.id, 10);
  if (requestedId !== req.user.id) {
    return res.status(403).render("403");
  }
  res.render("profile", { user: req.user });
}; 