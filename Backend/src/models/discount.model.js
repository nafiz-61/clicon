const mongoose = require("mongoose");
const { Schema, Types } = mongoose;
const { slugify } = require("slugify");

const discountSchema = new Schema(
  {
    discountvalidFrom: {
      type: Date,
      required: true,
    },

    discountvalidTo: {
      type: Date,
      required: true,
    },
    discountName: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    discountType: {
      type: String,
      enum: ["tk", "percentance"],
      required: true,
    },
    discountValueByAmount: {
      type: Number,
      default: 0,
    },
    discountValueByPerchentance: {
      type: Number,
      max: 100,
      default: 0,
    },
    discountPlan: {
      type: String,
      enum: ["category", "subCategory", "product", "flat"],
      required: true,
    },
    category: {
      type: Types.ObjectId,
      ref: "category",
      default: null,
    },
    subCategory: {
      type: Types.ObjectId,
      ref: "subCategory",
      default: null,
    },
    product: {
      type: Types.ObjectId,
      ref: "product",
      default: null,
    },
    idActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug from discountName
discountSchema.pre("save", async function (next) {
  if (this.isModified("discountName")) {
    this.slug = await slugify(this.discountName, {
      replacement: "-",
      lower: true,
      strict: true,
    });
  }
  next();
});

// Check if slug already exists
discountSchema.pre("save", async function (next) {
  const existingDiscount = await this.constructor.findOne({
    slug: this.slug,
  });

  if (
    existingDiscount &&
    existingDiscount._id.toString() !== this._id.toString()
  ) {
    throw new Error(
      "Discount with this name already exists, try another name!"
    );
  }

  next();
});

module.exports =
  mongoose.models.Discount || mongoose.model("Discount", discountSchema);
