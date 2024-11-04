import JWT from 'jsonwebtoken';
import userModel from '../models/userModel.js'

// User Auth
export const isAuth = async (req, res, next) => {
  const { token } = req.cookies;

  // Validation
  if (!token) {
    return res.status(401).send({
      success: false,
      message: "Unauthorized User: No token provided",
    });
  }
  
  try {
    const decodeData = JWT.verify(token, process.env.JWT_SECRET);
    req.user = await userModel.findById(decodeData._id);

    // Kiểm tra xem người dùng có tồn tại hay không
    if (!req.user) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized User: User not found",
      });
    }

    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    res.status(401).send({
      success: false,
      message: "Unauthorized User: Invalid token",
      error: error.message || "An error occurred during authentication",
    });
  }
};


// Admin Auth
export const isAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(401).send({
      success: false,
      message: "admin only",
    });
  }
  next();
};