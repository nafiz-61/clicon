const mongoose = require("mongoose");
const { customError } = require("../utils/customError");
const { Schema } = mongoose;

const deliveryChargeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  charge: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
});

deliveryChargeSchema.pre("save", async function (next) {
  const isExist = await this.constructor.findOne({ name: this.name });
  if (isExist && isExist._id.toString() !== this._id.toString()) {
    throw new customError("Delivery charge with this name already exists");
  }
  next();
});

module.exports =
  mongoose.models.DeliveryCharge ||
  mongoose.model("DeliveryCharge", deliveryChargeSchema);
