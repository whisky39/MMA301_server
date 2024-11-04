import express from 'express'
import { isAdmin, isAuth } from '../middlewares/authMiddlewares.js'
import { singleUpload } from '../middlewares/multer.js'
import { 
  createCategoryController, 
  deleteCategoryController, 
  getAllCategoryController,
  updateCategoryController 
} from '../controllers/categoryController.js'

const router = express.Router()

// Create Category
router.post('/create', isAuth, isAdmin, createCategoryController)

// Get All Category
router.get('/get-all', getAllCategoryController)

// Delete Category
router.delete('/delete/:id', isAuth, isAdmin ,deleteCategoryController)

// Update Category
router.put('/update/:id', isAuth, isAdmin, updateCategoryController)

export default router
