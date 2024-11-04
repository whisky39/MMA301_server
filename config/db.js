import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    // Kết nối MongoDB
    mongoose
      .connect(process.env.MONGO_URL) // cần chắc chắn rằng trong file .env đã khai báo biến MONGO_DB chứa URI của MongoDB.
      // respone trả về sau khi connect thành công
      .then(() => {
        console.log('Connect Db Success')
      })
      // respone err trả về nếu có lỗi
      .catch(err => {
        console.log('Your connect is fail by', err)
      })
  } catch (error) {
    console.log(error)
  }
}

export default connectDB
