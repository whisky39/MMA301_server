import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      require: [true, 'Category is required']
    }
  },
  { timestamps: true }
)

export const categoryModel = mongoose.model('Category', categorySchema, 'categories')
export default categoryModel
