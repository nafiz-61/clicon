const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
const { Schema, Types } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {},
    slug: {
      type: String,
      trim: true,
      unique: true,
    },
    subCategory: [
      {
        type: Types.ObjectId,
        ref: "subCategory",
      },
    ],
    discount: {
      type: Types.ObjectId,
      ref: "discount",
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

// make a slug
categorySchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    this.slug = await slugify(this.name, {
      replacement: "-",
      lower: false,
      strict: false,
    });
  }
  next();
});

// check the category already exists or not
categorySchema.pre("save", async function (next) {
  const findCategory = await this.constructor.findOne({ name: this.name });
  if (findCategory && findCategory._id.toString() !== this._id.toString()) {
    throw new customError(
      400,
      "findCategory already Exist try another email !"
    );
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);
