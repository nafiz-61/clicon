const mongoose = require("mongoose");
const { Schema } = mongoose;

const couponSchema = new Schema(
  {
    code: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    expireAt: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      max: 100,
      required: true,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
    discountType: {
      type: String,
      enum: ["percentage", "tk"],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

couponSchema.pre("save", async function (next) {
  const existingCoupon = await this.constructor.findOne({
    _id: this._id,
  });

  if (existingCoupon && existingCoupon._id.toString() !== this._id.toString()) {
    throw new Error("Coupon with this code already exists, try another code!");
  }

  next();
});

module.exports = mongoose.model("Coupon", couponSchema);
