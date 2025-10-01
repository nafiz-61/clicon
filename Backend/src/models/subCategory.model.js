const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const { default: slugify } = require("slugify");

//subCategory Schema
const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: Types.ObjectId,
      ref: "category",
      required: true,
    },
    discount: {
      type: Types.ObjectId,
      ref: "discount",
      default: null,
    },
    slug: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

//make a slug
subCategorySchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    this.slug = await slugify(this.name, {
      replacement: "-",
      lower: false,
      strict: false,
    });
  }
  next();
});

// check if slug already exists
subCategorySchema.pre("save", async function (next) {
  const existingSubcategory = await this.constructor.findOne({
    slug: this.slug,
  });

  if (
    existingSubcategory &&
    existingSubcategory._id.toString() !== this._id.toString()
  ) {
    throw new Error("Subcategory already Exist try another name ");
  }
  next();
});

const categoryPopulate = async function (next) {
  this.populate({
    path: "category",
  });
  next();
};

const sortsubCategory = async function (next) {
  this.sort({ createdAt: -1 });
  next();
};

subCategorySchema.pre("find", sortsubCategory, categoryPopulate);
subCategorySchema.pre("findOne", categoryPopulate);

module.exports =
  mongoose.model.Subcategory ||
  mongoose.model("Subcategory", subCategorySchema);
