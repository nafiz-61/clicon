const Joi = require("joi");
const { customError } = require("../utils/customError");

// Define Category Validation Schema
const categoryValidationSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.base": "Category name must be a string.",
    "string.empty": "Category name is required.",
    "any.required": "Category name is required.",
    "string.trim": "Category name should not contain extra spaces.",
  }),
}).options({
  abortEarly: true,
  allowUnknown: true, // Allows additional optional fields like image, slug, etc.
});

// Async function to validate category
exports.validateCategory = async (req) => {
  try {
    const value = await categoryValidationSchema.validateAsync(req.body);
    console.log(req.files);

    // allow MIME types
    const allowedMimeTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
    ];

    //check MIME type
    if (!allowedMimeTypes.includes(req?.files?.image[0]?.mimetype)) {
      throw new customError(
        400,
        "Invalid image type.OPNG and JPG image files are allowed,"
      );
    }

    if (req.files?.image?.length == 0) {
      throw new customError(400, "Image not found");
    }

    if (req.files.image[0].size >= 10 * 1024 * 1024) {
      throw new customError(400, "Image size is too Large. Max 5MB allowed");
    }

    return { name: value.name, image: req?.files?.image[0] };
  } catch (error) {
    if (error.details) {
      console.log("Error from validateCategory:", error.details[0].message);
      throw new customError(
        400,
        `Category Validation Failed: ${error.details[0].message}`
      );
    } else {
      console.log("Error from validateCategory:", error);
      throw new customError(400, `Category Validation Failed:${error.message}`); 
    }
  }
};
