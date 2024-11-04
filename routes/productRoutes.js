import express from 'express'
import { isAdmin, isAuth } from '../middlewares/authMiddlewares.js'
import { singleUpload } from '../middlewares/multer.js'
import {
  createProductController,
  deleteProductController,
  deleteProductImageController,
  getAllProductsController,
  getSingleProductController,
  getTopProductsController,
  productReviewController,
  updateProductController,
  updateProductImageController,
  getAllProductsByCateController
} from '../controllers/productController.js'

const router = express.Router()

// Get All Products
router.get('/get-all', getAllProductsController)

// Get All Products
router.get('/get/:cate', getAllProductsByCateController)

// Get TOP Products
router.get('/top', getTopProductsController)

// Get Single Product
router.get('/:id', getSingleProductController)

// Create Product
router.post('/create-product', isAuth, isAdmin, singleUpload, createProductController)

// Update Product
router.put('/:id', isAuth, isAdmin, updateProductController)

// Update Product Image
router.put('/image/:id', isAuth, isAdmin, singleUpload, updateProductImageController)

// Delete Product Image
router.delete('/delete-image/:id', isAuth, isAdmin, deleteProductImageController)

// Delete Product
router.delete('/delete/:id', isAuth, isAdmin, deleteProductController)

// Review Product
router.put('/:id/review', isAuth, productReviewController)

export default router
