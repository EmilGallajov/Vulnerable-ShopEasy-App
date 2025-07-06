const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
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

app.get("/orders", (req, res) => res.redirect("/order"));

app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(PORT, () => {
  console.log(`IDOR + Broken Auth lab running at http://localhost:${PORT}`);
});
