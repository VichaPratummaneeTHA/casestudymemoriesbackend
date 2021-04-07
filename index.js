import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import postRoutes from './routes/posts.js'
import userRoutes from './routes/user.js'

const app = express();
dotenv.config();

app.use(bodyParser.json({
  limit: '30mb',
  extended: true,
}))

app.use(bodyParser.urlencoded({
  limit: '30mb',
  extended: true,
}))

app.use(cors())
app.use('/posts', postRoutes)
app.use('/user', userRoutes)

app.get('/', (req, res) => {
  res.send('Hello to postmemories API ...')
})

//connect mongoose db

// const CONNECT_URL = 'mongoose db'

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECT_URL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    console.log('MongoDB Connect Successfully ...')
  } catch (error) {
    console.log(error.message)
  }
 
}

connectDB()
const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server Started On Port ${PORT}`))