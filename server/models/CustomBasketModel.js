const mongoose = require("mongoose");

const customBasketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      default: "Giỏ quà tùy chỉnh",
    },
    packaging: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Packaging",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        priceAtTime: {
          type: Number,
          required: true,
          comment: "Price of the product when added to basket",
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
      comment: "Packaging price + sum of all item prices",
    },
    status: {
      type: String,
      enum: ["draft", "completed", "added_to_cart"],
      default: "draft",
    },
    reservedUntil: {
      type: Date,
      comment: "Items reserved for 15 minutes (BR-03)",
    },
  },
  { timestamps: true },
);

// Calculate total price before saving
customBasketSchema.pre("save", async function (next) {
  if (this.isModified("items") || this.isModified("packaging")) {
    await this.populate("packaging");

    const packagingPrice = this.packaging?.price || 0;
    const itemsTotal = this.items.reduce((sum, item) => {
      return sum + item.priceAtTime * item.quantity;
    }, 0);

    this.totalPrice = packagingPrice + itemsTotal;
  }
  next();
});

// Method to check if basket meets minimum composition (BR-02)
customBasketSchema.methods.meetsMinimumComposition = function () {
  const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  return totalItems >= 3;
};

// Method to check if basket is within capacity
customBasketSchema.methods.isWithinCapacity = async function () {
  await this.populate("packaging");
  const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  return totalItems <= (this.packaging?.capacity || 0);
};

// Method to set reservation time (BR-03)
customBasketSchema.methods.setReservation = function () {
  this.reservedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
};

module.exports = mongoose.model("CustomBasket", customBasketSchema);
