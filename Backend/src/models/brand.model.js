const mongoose = require("mongoose");
const slugify = require("slugify");
const { Schema } = mongoose;

// brand schema
const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
    },
    image: {},
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// make a slug
brandSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    this.slug = await slugify(this.name, {
      replacement: "-",
      lower: true,
      strict: true,
    });
  }
  next();
});

// check the category already exists or not
brandSchema.pre("save", async function (next) {
  const existingBrand = await this.constructor.findOne({ slug: this.slug });
  if (existingBrand && existingBrand._id.toString() !== this._id.toString()) {
    throw new customError(400, "Brand already Exist try another email !");
  }
  next();
});

module.exports = mongoose.models.Brand || mongoose.model("Brand", brandSchema);
