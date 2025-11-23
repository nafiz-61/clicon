const express = require("express");
const _ = express.Router();
const orderController = require("../../controller/order.controller");

_.route("/create-order").post(orderController.createOrder);
_.route("/all-orders").get(orderController.getAllOrders);
_.route("/update-order").put(orderController.updateOrderInfo);
_.route("/order-status").get(orderController.OrderStatus);
_.route("/couriarPending").get(orderController.couriarPending);
_.route("/couriar-order").post(orderController.sendToCouriar);
_.route("/webhook").post(orderController.webhook);
module.exports = _;
