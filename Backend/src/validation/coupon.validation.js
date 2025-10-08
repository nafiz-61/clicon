const Joi = require("joi");
const { CustomError } = require("../utils/customError");

const couponValidationSchema = Joi.object({
  code: Joi.string().trim().required().messages({
    "string.base": "Coupon code must be a string.",
    "string.empty": "Coupon code is required.",
    "any.required": "Coupon code is required.",
  }),

  expireAt: Joi.date().required().messages({
    "date.base": "Expire date must be a valid date.",
    "any.required": "Expire date is required.",
  }),

  usageLimit: Joi.number().integer().max(100).required().messages({
    "number.base": "Usage limit must be a number.",
    "number.max": "Usage limit cannot exceed 100.",
    "any.required": "Usage limit is required.",
  }),

  usedCount: Joi.number().integer().min(0).messages({
    "number.base": "Used count must be a number.",
    "number.min": "Used count cannot be negative.",
  }),

  discountType: Joi.string().valid("percentage", "tk").messages({
    "any.only": 'Discount type must be either "percentage" or "tk".',
    "any.required": "Discount type is required.",
  }),

  discountValue: Joi.number().positive().messages({
    "number.base": "Discount value must be a number.",
    "number.positive": "Discount value must be greater than 0.",
    "any.required": "Discount value is required.",
  }),

  isActive: Joi.boolean().default(true),
}).options({
  abortEarly: true,
  allowUnknown: true,
});

exports.validateCoupon = async (req) => {
  try {
    const value = await couponValidationSchema.validateAsync(req.body);

    // Optional: Prevent expiry date in the past
    if (new Date(value.expireAt) < new Date()) {
      throw new CustomError(400, "Expire date cannot be in the past.");
    }

    return value;
  } catch (error) {
    if (error.details) {
      console.log("Error from validateCoupon:", error.details[0].message);
      throw new CustomError(
        400,
        `Coupon Validation Failed: ${error.details[0].message}`
      );
    } else {
      console.log("Error from validateCoupon:", error);
      throw new CustomError(400, `Coupon Validation Failed: ${error.message}`);
    }
  }
};
