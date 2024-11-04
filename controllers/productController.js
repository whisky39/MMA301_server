import productModel from "../models/productModel.js";
import cloudinary from "cloudinary";
import { getDataUri } from "../utils/features.js";

// ============================================= PRODUCTS CONTROLLER ===================================================== //

// Get All Products
export const getAllProductsController = async (req, res) => {
  const { keyword, category } = req.query;
  try {
    const products = await productModel.find({
      name: {
        $regex: keyword ? keyword : "",
        $options: "i",
      },
      // category: category ? category : null,
    });
    return res.status(200).json({
      success: true,
      message: "all products fetched successfully",
      totalProducts: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Get All Products API",
      error,
    });
  }
};

export const getTopProductsController = async (req, res) => {
  try {
    const products = await productModel.find({}).sort({ rating: -1 }).limit(3);
    res.status(200).send({
      success: true,
      message: "Top 3 products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Get Top Products API",
      error,
    });
  }
};

// Get all Product by cate
export const getAllProductsByCateController = async (req, res) => {
  try {
    const category = req.params.cate; // Lấy category từ params
    
    const products = await productModel.find({ category: category }); // Tìm tất cả sản phẩm theo category

    // validation
    if (!products || products.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No products found for this category",
      });
    }

    res.status(200).send({
      success: true,
      message: "Products found",
      products, // Trả về danh sách sản phẩm
    });
  } catch (error) {
    console.log(error);
    // Xử lý lỗi cast hoặc OBJECT ID
    if (error.name === "CastError") {
      return res.status(400).send({
        success: false,
        message: "Invalid category",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error Get All Products by Category API",
      error,
    });
  }
};

// Get Single Product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    // validation
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Product found",
      product,
    });
  } catch (error) {
    console.log(error);
    //cast error || OBJECT ID
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid ID",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error Get All Products API",
      error,
    });
  }
};

// Create Product
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    // validtion
    if (!name || !description || !price || !category || !stock) {
      return res.status(500).send({
        success: false,
        message: "Please Provide all fields",
      });
    }

    // if (!req.file) {
    //   return res.status(500).send({
    //     success: false,
    //     message: "please provide product images",
    //   });
    // }

    // const file = getDataUri(req.file);
    // const cdb = await cloudinary.v2.uploader.upload(file.content);
    // const image = {
    //   public_id: cdb.public_id,
    //   url: cdb.secure_url,
    // };

    const newProduct = await productModel.create({
      name,
      description,
      price,
      category,
      stock,
      // images: [image],
      images: {
        public_id: "",
        url: "",
      },
    });

    res.status(201).json({
      status: "OK",
      success: true,
      message: "Product Created Successfully",
      data: newProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "ERROR",
      success: false,
      message: "Error In Get single Products API",
      error,
    });
  }
};

// Update Product
export const updateProductController = async (req, res) => {
  try {
    // find product
    const product = await productModel.findById(req.params.id);
    // validation
    if (!product) {
      return res.status(500).send({
        success: false,
        message: "Product not found",
      });
    }
    const { name, description, price, stock, category } = req.body;

    // validate and update
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    await product.save();
    res.status(200).send({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    //cast error || OBJECT ID
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid ID",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In Update Product API",
      error,
    });
  }
};

// UPDATE PRODUCT IMAGE
export const updateProductImageController = async (req, res) => {
  try {
    // find product
    const product = await productModel.findById(req.params.id);
    // valdiation
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    // check file
    if (!req.file) {
      return res.status(404).send({
        success: false,
        message: "Product image not found",
      });
    }

    const file = getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    // save
    product.images.push(image);
    await product.save();
    res.status(200).send({
      success: true,
      message: "Product image updated",
    });
  } catch (error) {
    console.log(error);
    // cast error ||  OBJECT ID
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In Get UPDATE Products API",
      error,
    });
  }
};

export const deleteProductImageController = async (req, res) => {
  try {
    // find product
    const product = await productModel.findById(req.params.id);

    // validation
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    // find image id
    const id = req.query.id;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "Product image not found",
      });
    }

    let isExist = -1;
    product.images.forEach((item, index) => {
      if (item._id.toString() === id.toString()) isExist = index;
    });
    if (isExist < 0) {
      return res.status(404).send({
        success: false,
        message: "Image not found",
      });
    }

    // Delete Product Image
    await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);
    product.images.splice(isExist, 1);
    await product.save();
    return res.status(200).send({
      success: true,
      message: "Product Image Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    // cast error ||  OBJECT ID
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In DELETE Image Product API",
      error,
    });
  }
};

// Delete Product
export const deleteProductController = async (req, res) => {
  try {
    // find product
    const product = await productModel.findById(req.params.id);

    // validation
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "product not found",
      });
    }

    // find and delete image cloudinary
    for (let index = 0; index < product.images.length; index++) {
      await cloudinary.v2.uploader.destroy(product.images[index].public_id);
    }
    await product.deleteOne();
    res.status(200).send({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    // cast error ||  OBJECT ID
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In Get DELETE Product IMAGE API",
      error,
    });
  }
};

// Create Product Review And Comment
export const productReviewController = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    // find product
    const product = await productModel.findById(req.params.id);
    // check previous review
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).send({
        success: false,
        message: "Product Alredy Reviewed",
      });
    }
    // review object
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    // passing review object to reviews array
    product.reviews.push(review);
    // number or reviews
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    // save
    await product.save();
    res.status(200).send({
      success: true,
      message: "Review Added!",
    });
  } catch (error) {
    console.log(error);
    // cast error ||  OBJECT ID
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error In Review Comment API",
      error,
    });
  }
};

// ============================================= PRODUCT CTRL ENDS ======================================================= //
