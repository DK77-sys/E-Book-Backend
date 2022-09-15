import express from "express"
import UserController from "../controllers/UserController.js"

const route = express.Router()

route.get("/", UserController.getAllUsers)
route.get("/:id", UserController.getUserById)

export default route
