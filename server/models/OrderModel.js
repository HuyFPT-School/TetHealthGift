const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cartItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        imageUrl: { type: String },
        // Custom basket fields
        isCustomBasket: { type: Boolean, default: false },
        basketDetails: {
          packaging: {
            name: String,
            price: Number,
          },
          items: [
            {
              productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
              },
              name: String,
              quantity: Number,
              price: Number,
              imageUrl: String,
            },
          ],
        },
      },
    ],

    shippingAddress: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    note: {
      type: String,
      trim: true,
    },

    totalAmount: { type: Number, required: true },

    isInstallment: { type: Boolean, default: false },
    depositAmount: { type: Number, default: 0 },
    remainingBalance: { type: Number, default: 0 },
    depositDeadline: { type: Date },

    paymentMethod: {
      type: String,
      enum: ["momo", "vnpay", "cod"],
      default: "cod",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "deposited", "paid", "failed", "refunded"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled", "return_requested", "returned"],
      default: "processing",
    },
    cancelReason: { type: String },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
