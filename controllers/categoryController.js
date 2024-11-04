import categoryModel from '../models/categoryModel.js'
import productModel from '../models/productModel.js'

// ============================================= CATEGORY CONTROLLER ===================================================== //

// Create Category
export const createCategoryController = async (req, res) => {
  try {
    const { category } = req.body
    // validation
    if (!category) {
      return res.status(404).send({
        success: false,
        message: 'Please provide category name'
      })
    }
    await categoryModel.create({ category })
    res.status(201).send({
      success: true,
      message: `${category} category created successfully`
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error In Create Cat API'
    })
  }
}

// Get All Category
export const getAllCategoryController = async (req, res) => {
  try {
    const categories = await categoryModel.find({})
    res.status(200).send({
      success: true,
      message: 'Category Fetch Successfully',
      totalCat: categories.length,
      categories
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      success: false,
      message: 'Error In Get All Category API'
    })
  }
}

// Delete Category
export const deleteCategoryController = async (req, res) => {
  try {
    //find category
    const category = await categoryModel.findById(req.params.id)

    // validation
    if (!category) {
      return res.status(404).send({
        success: false,
        message: 'Category Not Found'
      })
    }

    // find product with category id
    const products = await productModel.find({ category: category.id })

    // update product category
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      product.category = undefined
      await product.save()
    }

    // save
    await category.deleteOne()
    res.status(200).send({
      success: true,
      message: 'Category Delete Successfully'
    })
  } catch (error) {
    console.log(error)
    // cast error ||  OBJECT ID
    if (error.name === 'CastError') {
      return res.status(500).send({
        success: false,
        message: 'Invalid Id'
      })
    }

    res.status(500).send({
      success: false,
      message: 'Error In Delete Category API'
    })
  }
}

// Update Category
export const updateCategoryController = async (req, res) => {
  try {
    // find category
    const category = await categoryModel.findById(req.params.id)

    // validation
    if (!category) {
      return res.status(404).send({
        success: false,
        message: 'Category Not Found'
      })
    }

    // get new cat
    const { updateCategory } = req.body

    // find product with category id
    const products = await productModel.find({ category: category.id })

    // update product category
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      product.category = updateCategory
      await product.save()
    }

    if(updateCategory) category.category = updateCategory

    // save
    await category.save()
    res.status(200).send({
      success: true,
      message: 'Category Updated Successfully'
    })
    
  } catch (error) {
    console.log(error)
    // cast error ||  OBJECT ID
    if (error.name === 'CastError') {
      return res.status(500).send({
        success: false,
        message: 'Invalid Id'
      })
    }
    res.status(500).send({
      success: false,
      message: 'Error In Update Category API'
    })
  }
}

// ============================================= CATEGORY CONTROLLER END ================================================= //
