const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { sessionMiddleware, requireAuth } = require("../controllers/authController");

router.get("/login", authController.showLogin);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/profile/:id", sessionMiddleware, requireAuth, authController.profile);

module.exports = router; 