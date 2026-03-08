const mongoose = require("mongoose");

const packagingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["basket", "box", "bag"],
    },
    description: { type: String },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      comment: "Maximum number of items this packaging can hold",
    },
    imageUrl: { type: String },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    dimensions: {
      width: Number,
      height: Number,
      depth: Number,
      unit: { type: String, default: "cm" },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Packaging", packagingSchema);
