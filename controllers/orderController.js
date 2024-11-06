import cloudinary from "cloudinary";
import { getDataUri } from "../utils/features.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import { stripe } from "../server.js";

export const createOrderController = async (req, res) => {
  try {
    console.log("req.body : ", req.body);

    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      // itemPrice,
      // tax,
      // shippingCharges,
      // totalAmount,
    } = req.body;

    const convertPriceToNumber = (price) => {
      return Number(price.replace(/[^0-9.-]+/g, ""));
    };

    // valdiation
    // create order
    const createdOrder = await orderModel.create({
      user: req.user._id,
      shippingInfo,
      orderItems,
      paymentMethod: "COD",
      paymentInfo,
      itemPrice: convertPriceToNumber(orderItems.price),
      tax: 10000,
      shippingCharges: 10000,
      totalAmount: convertPriceToNumber(orderItems.price) + 10000 + 10000,
    });

    // stock update
    // for (let i = 0; i < orderItems.length; i++) {
    //   // find product
    //   const product = await productModel.findById(orderItems[i].product);
    //   product.stock -= orderItems[i].quantity;
    //   await product.save();
    // }

    if (createdOrder) {
      res.status(201).json({
        status: "OK",
        success: true,
        message: "Order Placed Successfully",
        data: createdOrder,
      });
    } else {
      res.status(201).json({
        status: "ERROR",
        success: true,
        message: "Order Placed Failed",
        data: createdOrder,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Create Order API",
      error,
    });
  }
};

// Get All Orders - My Orders
export const getMyOrdersController = async (req, res) => {
  try {
    // find orders
    const orders = await orderModel.find({ user: req.user._id });

    // validation
    if (!orders) {
      return res.status(404).send({
        success: false,
        message: "No Orders Found",
      });
    }
    res.status(200).send({
      status: "OK",
      success: true,
      message: "Your Order Data",
      totalOrder: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In My Orders API",
      error,
    });
  }
};

// Get Single Order Details
export const singleOrderDetailsController = async (req, res) => {
  try {
    // find orders
    const orders = await orderModel.findById(req.params.id);
    // validation
    if (!orders) {
      return res.status(404).send({
        success: false,
        message: "No Order Found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Your Order Fetched",
      orders,
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
      message: "Error In Get Single Order Details API",
      error,
    });
  }
};

// Accept Payment
export const paymentsController = async (req, res) => {
  try {
    // get ampunt
    const { totalAmount } = req.body;
    // validation
    if (!totalAmount) {
      return res.status(404).send({
        success: false,
        message: "Total Amount is require",
      });
    }
    const { client_secret } = await stripe.paymentIntents.create({
      amount: Number(totalAmount * 100),
      currency: "usd",
    });
    res.status(200).send({
      success: true,
      client_secret,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Payment API",
      error,
    });
  }
};

// Admin Section
// Get All Orders - Admin
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.status(200).json({
      status: "OK",
      success: true,
      message: "All Orders Data",
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Get UPDATE Products API",
      error,
    });
  }
};

// Change Order Status
export const removeOrder = async (req, res) => {
  try {
    // find order
    const order = await orderModel.findByIdAndDelete(req.params.id);
    if (order) {
      return res.status(200).json({
        status: "OK",
        message: "Delete order successfully",
      });
    }
  } catch (error) {
    // cast error ||  OBJECT ID
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Id",
      });
    }
    res.status(500).send({
      success: false,
      message: "Error Change Order Status Of Admin API",
      error,
    });
  }
};

// Change Order Status
export const changeOrderStatusController = async (req, res) => {
  try {
    // find order
    const order = await orderModel.findById(req.params.id);

    // validation
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order Not Found",
      });
    }

    if (order.orderStatus === "processing") {
      order.orderStatus = "delivered";
      order.deliveredAt = Date.now();
    } else {
      return res.status(200).json({
        status: 500,
        success: false,
        message: "Order already delivered",
        data: order,
      });
    }
    const newDelivery = await order.save();

    if (newDelivery) {
      return res.status(200).json({
        status: "OK",
        success: true,
        message: "Order status updated",
        data: newDelivery,
      });
    }
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
      message: "Error Change Order Status Of Admin API",
      error,
    });
  }
};
