import express from "express"
import AuthController from "../controllers/AuthController.js"
const route = express.Router()

route.get("/refresh-token", AuthController.refreshToken)
route.post("/register", AuthController.register)
route.post("/login", AuthController.login)
route.post("/logout")
export default route
