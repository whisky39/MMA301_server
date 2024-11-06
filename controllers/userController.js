import userModel from "../models/userModel.js";
import cloudinary from "cloudinary";
import { getDataUri } from "../utils/features.js";

// ============================================= USER CONTROLLER ========================================================= //

// Create User
export const createController = async (req, res) => {
  try {
    const { name, email, password, address, city, country, phone } =

      req.body;
      
    if (
      !name ||
      !email ||
      !password ||
      !city ||
      !address ||
      !country ||
      !phone

    ) {
      return res.status(500).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }

    const user = await userModel.create({
      name,
      email,
      password,
      address,
      city,
      country,
      phone,
      answer: "11111",
    });
if (user) {
  res.status(201).json({
    status: "OK",
    success: true,
    message: "User Created Successfully",
    user,

  });
} 

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Register API",
      error,
    });
  }
};

//Login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("email , password ", email, password);
    //validations
    if (!email || !password) {
      return res.status(500).send({
        success: "false",
        message: "Please Add Email Or Password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    //user validations
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User Not Found",
      });
    }
    //check pass
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "invalid credentials",
      });
    }
    //token
    const token = user.generateToken();
    res.status(200).cookie("token", token, {
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      secure: process.env.NODE_ENV !== "development",
      httpOnly: true,
      sameSite: "Strict",
    });
    return res.status(200).json({
      status: "OK",
      success: true,
      message: "Login Successfully",
      token,
      user,
    });
    // console.log('token:', token)
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: "false",
      message: "Error In Login Api",
      error,
    });
  }
};

// Logout
export const logoutController = async (req, res) => {
  try {
    // clear token when logout
    res.clearCookie("token");

    return res.status(200).json({
      status: "OK",
      message: "Logout Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Logout API",
      error,
    });
  }
};

//Get User Profile
export const getUserProfileController = async (req, res) => {
  try {
    const token = req.cookies['token']; // Thay 'refresh_token' bằng tên cookie của bạn
    
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "No token provided, authorization denied.",
      });
    }
    
    const user = await userModel.findById(req.user._id);
    user.password = undefined;
    res.status(200).send({
      success: true,
      message: "User Profile Fetch Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Profile API",
      error,
    });
  }
};

//Get List User Profile
export const getAllController = async (req, res) => {
  try {
    const token = req.cookies['token']; 
    
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "No token provided, authorization denied.",
      });
    }
    
    const users = await userModel.find();

    res.status(200).send({
      success: true,
      message: "Users Fetch Successfully",
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Profile API",
      error,
    });
  }
};

// Update User Profile
export const updateProfileController = async (req, res) => {
  try {
    const token = req.cookies['token']; // Thay 'refresh_token' bằng tên cookie của bạn
    
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "No token provided, authorization denied.",
      });
    }
    const user = await userModel.findById(req.user._id);
    const { name, password ,address, city, country, phone } = req.body;
    //Validation
    if (name) user.name = name;
    if (address) user.address = address;
    if (city) user.city = city;
    if (country) user.country = country;
    if (phone) user.phone = phone;
    if (password) user.password = password;
    //Save user
    await user.save();
    res.status(200).send({
      success: true,
      message: "User Profile Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Update Profile API",
      error,
    });
  }
};

// Update User Password
export const updatePasswordController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;
    //validation
    if (!oldPassword || !newPassword) {
      return res.status(500).send({
        success: false,
        message: "Please provide old or new password",
      });
    }

    //check old password
    const isMatch = await user.comparePassword(oldPassword);

    //validation
    if (!isMatch) {
      return res.status(500).send({
        success: false,
        message: "Old password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).send({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Update Password API",
      error,
    });
  }
};

// Update user profile photo
export const updateProfilePicController = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    // file get from client photo
    const file = getDataUri(req.file);

    // delete prev image
    await cloudinary.v2.uploader.destroy(user.profilePicture.public_id);

    // update
    const cdb = await cloudinary.v2.uploader.upload(file.content);
    user.profilePicture = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    // save func
    await user.save();

    res.status(200).send({
      success: true,
      message: "profile picture updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In update profile pic API",
      error,
    });
  }
};

// Reset Password
export const passwordResetController = async (req, res) => {
  try {
    const { email, newPassword, answer } = req.body;
    // validation
    if (!email || !newPassword || !answer) {
      return res.status(500).send({
        success: false,
        message: "Please provide all fields",
      });
    }
    // find user
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid User or Answer",
      });
    }

    user.password = newPassword;

    await user.save();
    res.status(202).send({
      success: true,
      message: "Your Password Has Been Reset Please Login !",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error In Reset Password API",
    });
  }
};

// ============================================= USER CONTROLLER END ===================================================== //
