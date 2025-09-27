require("dotenv").config();
const { customError } = require("../utils/customError");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

//upload image into cloudinary
exports.uploadImage = async (filePath) => {
  try {
    if (!filePath && !fs.existsSync(filePath)) {
      throw new customError(401, "filePath missing");
    }
    //upload image
    const image = await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
      quality: "auto",
    });
    if (image) {
      fs.unlinkSync(filePath);
      return { publicId: image.public_id, url: image.secure_url };
    }
    console.log(image);
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return { publicId: image.public_id, url: image.secure_url };
    }
    console.log("Error from cloudinary file upload", error);
    throw new customError(
      500,
      "Error from cloudinary file upload" + error.message
    );
  }
};

// delete cloudinary image
exports.deleteImage = async (public_id) => {
  try {
    const response = await cloudinary.uploader.destroy(public_id, {
      resource_type: "image",
      quality: "auto",
    });
    return response;
  } catch (error) {
    console.log("Error deleting image", error);
    throw new customError(500, "Error from delete image ", error.message);
  }
};
