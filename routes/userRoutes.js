import express from 'express'
import {
  createController,
  getUserProfileController,
  loginController,
  logoutController,
  passwordResetController,
  updatePasswordController,
  updateProfileController,
  updateProfilePicController,
  getAllController
} from '../controllers/userController.js'
import { isAuth } from '../middlewares/authMiddlewares.js'
import { singleUpload } from '../middlewares/multer.js'
import { rateLimit } from 'express-rate-limit'

// Rate Limiter - Giới hạn số lượng yêu cầu mà mỗi địa chỉ IP gửi đến server
const limiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false // Disable the `X-RateLimit-*` headers.
  // store: ... , // Redis, Memcached, etc. See below.
})

//router object
const router = express.Router()

//routes
//create
router.post('/create', limiter, createController)

// Login
router.post('/login', limiter, loginController)

// Logout
router.post("/logout", isAuth, logoutController);

// Get User Profile
router.get('/profile', isAuth, getUserProfileController)

// Get User Profile
router.get('/getAll', isAuth, getAllController)

// update profile
router.put('/update-profile', isAuth, updateProfileController)

// update password
router.put('/update-password', isAuth, updatePasswordController)

// update profile pic
router.put('/update-picture', isAuth, singleUpload, updateProfilePicController)

// Forgot Password
router.post('/reset-password', passwordResetController)

//export
export default router
