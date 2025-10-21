const Joi = require("joi");
const { customError } = require("../utils/customError");

// Joi Validation Schema
const deliveryChargeValidationSchema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required().messages({
    "string.base": "Delivery charge name must be a string.",
    "string.empty": "Delivery charge name is required.",
    "string.min": "Delivery charge name must be at least 3 characters long.",
    "string.max": "Delivery charge name cannot exceed 50 characters.",
    "any.required": "Delivery charge name is required.",
  }),

  charge: Joi.number().min(0).max(10000).required().messages({
    "number.base": "Delivery charge must be a valid number.",
    "number.min": "Delivery charge cannot be negative.",
    "number.max": "Delivery charge cannot exceed 10000.",
    "any.required": "Delivery charge amount is required.",
  }),

  description: Joi.string().trim().max(200).allow("").messages({
    "string.base": "Description must be a string.",
    "string.max": "Description cannot exceed 200 characters.",
  }),
}).options({
  abortEarly: true,
  allowUnknown: true,
});

// Async Validation Function
exports.validateDeliveryCharge = async (req) => {
  try {
    // Joi validation check
    const value = await deliveryChargeValidationSchema.validateAsync(req.body);

    // Return valid data if all checks pass
    return value;
  } catch (error) {
    if (error.details) {
      console.log("Error from validateDeliveryCharge:", error);
      throw new customError(
        400,
        `Delivery Charge Validation Failed: ${error.details[0].message}`
      );
    } else {
      console.log("Error from validateDeliveryCharge:", error);
      throw new customError(
        400,
        `Delivery Charge Validation Failed: ${error.message}`
      );
    }
  }
};
