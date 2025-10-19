// app.js
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const userModel = require("./models/userModel"); // Make sure this has a closeConnection method
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 3000;

// -------------------
// View Engine Setup
// -------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// -------------------
// Middleware
// -------------------
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// -------------------
// Request Logging Middleware
// -------------------
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const timestamp = new Date().toISOString();
    const duration = Date.now() - start;
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });

  next();
});

// -------------------
// Routes
// -------------------
app.use("/", authRoutes);
app.use("/order", orderRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/orders", (req, res) => {
  res.redirect("/order");
});

// -------------------
// 404 Handler
// -------------------
app.use((req, res) => {
  res.status(404).render("404");
});

// -------------------
// Start Server
// -------------------
const server = app.listen(PORT, () => {
  console.log(`Lab running at http://localhost:${PORT}`);
});

// -------------------
// Graceful Shutdown
// -------------------
const gracefulShutdown = async () => {
  console.log("\nShutting down gracefully...");
  try {
    await userModel.closeConnection();
  } catch (err) {
    console.error("Error closing DB connection:", err);
  }
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
