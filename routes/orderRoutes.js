const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { sessionMiddleware, requireAuth } = require("../controllers/authController");

router.use(sessionMiddleware);
router.get("/", requireAuth, orderController.listOrders);
router.get("/:id", requireAuth, orderController.getOrder);

module.exports = router; 