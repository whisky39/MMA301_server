import mongoose from "mongoose";

// Review Modal
const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    rating: {
      type: Number,
      default: 0,
    },
    comment: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "User required"],
    },
  },
  { timestamps: true }
);

// Product Modal
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "Product name is required"],
    },
    description: {
      type: String,
      require: [true, "Product description is required"],
    },
    price: {
      type: String,
      require: [true, "Product price is required"],
    },
    stock: {
      type: String,
      require: [true, "Product stock is required"],
    },
    quantity: {
      type: Number,
      require: [true, "Product quantity is required"],
    },
    category: {
      // type: mongoose.Schema.Types.ObjectId,
      type: String,
      ref: "Category",
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0,
    },
    numReview: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true } // Thêm ngày tạo
);

export const productModel = mongoose.model(
  "Product",
  productSchema,
  "products"
);
export default productModel;
