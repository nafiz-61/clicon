const Joi = require("joi");
const { customError } = require("../utils/customError");

const userValidationSchema = Joi.object({
  firstName: Joi.string().trim().empty().messages({
    "string.empty": "First name cannot be empty",
    "name.trim": "Name fill with extra spaces",
  }),
  phoneNumber: Joi.string()
    .optional()
    .trim()
    .pattern(/^(?:\+880|880|0)1[3-9]\d{8}$/)
    .messages({
      "string.pattern.base":
        "Phone number must be a valid Bangladeshi number (e.g. 01XXXXXXXXX, 8801XXXXXXXXX, or +8801XXXXXXXXX)",
      "string.base": "Phone number must be a string",
      "string.empty": "Phone number cannot be empty",
    }),
  email: Joi.string()
    .trim()
    .empty()
    .pattern(new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/))
    .messages({
      "string-empty": "Email is required.",
      "any.required": "Email is required.",
      "string.trim": "Email should not contain extra spaces,",
      "string.pattern.base": "Email format is invalid",
    }),
  password: Joi.string()
    .trim()
    .empty()
    .pattern(
      new RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/)
    )
    .messages({
      "string.empty": "Password is required.",
      "any.required": "Password is required.",
      "string.trim": "Password should not contain extra spaces.",
      "string.pattern.base":
        "Password must be 8–16 characters long, include at least one number and one special character.",
    }),
}).options({
  abortEarly: true,
  allowUnknown: true, //<----- this allows extra fields in req.body without validation
});

exports.validateUser = async (req) => {
  try {
    const value = await userValidationSchema.validateAsync(req.body);
    return value;
  } catch (error) {
    console.log("error  from validate User", error);
    throw new customError(400, `User Validation Failed ${error}`);
  }
};
