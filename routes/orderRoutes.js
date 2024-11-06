import express from 'express'
import { isAuth, isAdmin } from '../middlewares/authMiddlewares.js'
import { singleUpload } from '../middlewares/multer.js'
import { 
  changeOrderStatusController,
  createOrderController,
  getAllOrdersController,
  getMyOrdersController,
  paymentsController,
  singleOrderDetailsController,
  removeOrder
} from '../controllers/orderController.js'

const router = express.Router()

// USER PART
// Create Orders
router.post('/create', isAuth, createOrderController)

// Get All Orders
router.get('/my-orders', isAuth, getMyOrdersController)

// Get Single Order Details
router.get('/my-orders/:id', isAuth, singleOrderDetailsController)

// Accept Payments
router.post('/payments', isAuth, paymentsController)

// ADMIN PART
// Get All Orders
router.get('/admin/get-all-orders', isAuth, isAdmin, getAllOrdersController)

// Change Order Status
router.put('/admin/order/:id', isAuth, isAdmin, changeOrderStatusController)

// Change Order Status
router.delete('/admin/order/:id', isAuth, isAdmin, removeOrder)



export default router