const orderModel = require("../models/orderModel");

exports.listOrders = (req, res) => {
  const orders = orderModel.getAllOrders().filter(order => order.userId === req.user.id);
  res.render("orderList", { orders, user: req.user });
};

exports.getOrder = (req, res) => {
  const order = orderModel.getOrderById(req.params.id);
  if (!order) return res.status(404).render("404");
  res.render("orderDetail", { order, user: req.user });
}; 