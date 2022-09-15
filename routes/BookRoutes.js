import express from "express"
import BookController from "../controllers/BookController.js"
import Verify from "../middleware/Verify.js"

const route = express.Router()

route.get("/", BookController.getAllBooks)
route.get("/:id", BookController.getBookById)
route.post("/", Verify.verifyToken, BookController.addBook)
route.put("/:id", Verify.verifyToken, BookController.updateBook)
route.delete("/:id", Verify.verifyToken, BookController.deleteBook)

export default route
