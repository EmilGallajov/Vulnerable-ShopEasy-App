const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const userModel = require("./models/userModel");
const app = express();
const PORT = 3000;

const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", authRoutes);
app.use("/order", orderRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/orders", (req, res) => {
  // Redirect to /order (the actual orders page)
  res.redirect("/order");
});

app.use((req, res) => {
  res.status(404).render("404");
});

const server = app.listen(PORT, () => {
  console.log(`lab running at http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await userModel.closeConnection();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await userModel.closeConnection();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
