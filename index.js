import express, { urlencoded } from "express"
import BookRoutes from "./routes/BookRoutes.js"
import AuthRoutes from "./routes/AuthRoutes.js"
import UserRoutes from "./routes/UserRoutes.js"
import mongoose from "mongoose"
import cors from "cors"
import cookieParser from "cookie-parser"
import User from "./models/UserModel.js"
import jwt from "jsonwebtoken"
const app = express()
const port = 4000

app.use(express.json())
app.use(cors())
app.use(urlencoded({ extended: true }))
app.use(cookieParser())

mongoose
  .connect(
    "mongodb+srv://4dsec:sector1337@restapi.73u4qmb.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to database")
  })
  .catch((error) => {
    console.log(error)
  })

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.use("/books", BookRoutes)
app.use("/user", UserRoutes)
app.use("/auth", AuthRoutes)

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
