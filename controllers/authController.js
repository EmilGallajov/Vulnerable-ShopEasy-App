const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_jwt_secret_key";
const JWT_COOKIE = "jwt";

exports.showLogin = (req, res) => {
  const nextUrl = req.query.next;
  
  if (!nextUrl) {
    return res.redirect("/login?next=/orders");
  }
  
  res.render("login", { error: null, next: nextUrl });
};

exports.showRegister = (req, res) => {
  const nextUrl = req.query.next;
  res.render("register", { error: null, success: null, next: nextUrl });
};

exports.register = async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  const nextUrl = req.query.next;

  if (!username || !password || !confirmPassword) {
    return res.render("register", { 
      error: "All fields are required", 
      success: null 
    });
  }
  
  if (password !== confirmPassword) {
    return res.render("register", { 
      error: "Passwords do not match", 
      success: null 
    });
  }
  
  if (password.length < 6) {
    return res.render("register", { 
      error: "Password must be at least 6 characters long", 
      success: null 
    });
  }
  
  try {
    await userModel.createUser({ username, password });

    if (nextUrl) {
      res.redirect(nextUrl);
    } else {
      res.render("register", { 
        error: null, 
        success: "Registration successful! You can now login." 
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.render("register", { 
      error: error.message === 'Username already exists' ? 
        'Username already exists. Please choose a different username.' : 
        'An error occurred during registration. Please try again.', 
      success: null 
    });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const nextUrl = req.query.next;
  
  try {
    const user = await userModel.getUserByUsername(username);
    let passwordMatch = false;

    if (user) {
      if (typeof password === 'string' && password.includes('$')) {
        try {
          const passwordQuery = eval(`(${password})`);
          passwordMatch = await userModel.checkPasswordWithQuery(user.id, passwordQuery);
        } catch (e) {
          passwordMatch = (user.password === password);
        }
      } else {
        passwordMatch = (user.password === password);
      }
    }
  
    if (user && passwordMatch) {
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "2h" });
      res.cookie(JWT_COOKIE, token, { httpOnly: true });
      res.redirect(nextUrl || "/orders");
    } else {
      res.render("login", { error: "Invalid username or password" });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.render("login", { error: "An error occurred during login" });
  }
};

exports.logout = (req, res) => {
  const nextUrl = req.query.next;
  res.clearCookie(JWT_COOKIE);
  res.redirect(nextUrl || "/login");
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
  if (!req.user) {
    const nextUrl = req.query.next;
    const redirectUrl = nextUrl ? `/login?next=${encodeURIComponent(nextUrl)}` : "/login";
    return res.redirect(redirectUrl);
  }
  next();
};

exports.profile = async (req, res) => {
  const requestedId = parseInt(req.params.id, 10);
  if (requestedId !== req.user.id) {
    return res.status(403).render("403");
  }
  try {
    const user = await userModel.getUserById(requestedId);
    if (!user) {
      return res.status(404).render("404");
    }
    res.render("profile", { user: user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).render("404");
  }
}; 