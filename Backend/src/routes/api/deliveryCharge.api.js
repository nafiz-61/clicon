const express = require("express");
const _ = express.Router();
const DeliveryChargeController = require("../../controller/deliveryCharge.controller");

_.route("/create-delivery-charge").post(
  DeliveryChargeController.createDeliveryCharge
);

_.route("/get-all-delivery-charges").get(
  DeliveryChargeController.getAllDeliveryCharges
);

_.route("/get-single-delivery-charge/:id").get(
  DeliveryChargeController.getSingleDeliveryCharges
);

_.route("/update-delivery-charge/:id").put(
  DeliveryChargeController.updateDeliveryCharge
);

_.route("/delete-delivery-charge/:id").delete(
  DeliveryChargeController.deleteDeliveryCharge
);

module.exports = _;
