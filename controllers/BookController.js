import Book from "../models/BooksModel.js"
import jwt from "jsonwebtoken"

export default class BookController {
  static async getAllBooks(req, res) {
    let keyword = {}

    if (req.query.title) {
      keyword = {
        title: {
          $regex: req.query.title,
          $options: "i",
        },
      }
    }

    await Book.find(keyword)
      .then((data) => {
        if (data.length === 0)
          return res.status(404).json({
            status: 404,
            message: "Books data empty",
          })
        return res.status(200).json({
          status: 200,
          message: "Books retrieved successfully",
          data: data,
        })
      })
      .catch((error) => {
        return res.status(500).json({
          status: 500,
          message: error.message,
        })
      })
  }

  static async getBookById(req, res) {
    const id = req.params.id
    await Book.findById(id)
      .then((data) => {
        return res.status(200).json({
          status: 200,
          message: "Book retrieved successfully",
          data: data,
        })
      })
      .catch((error) => {
        return res.status(404).json({
          status: 404,
          message: "Book not found",
        })
      })
  }

  static async addBook(req, res) {
    const book = new Book({
      title: req.body.title,
      description: req.body.description,
      image: req.body.image,
    })
    await book.save((error, data) => {
      if (error) {
        return res.status(500).json({
          status: 500,
          message: error.message,
        })
      } else {
        return res.status(200).json({
          status: 200,
          message: "Book added successfully",
          data: data,
        })
      }
    })
  }

  static async updateBook(req, res) {
    const id = await Book.findById(req.params.id)
    if (!id)
      return res.status(404).json({
        status: 404,
        message: "Book not found",
      })
    await Book.findByIdAndUpdate(id, req.body)
      .then((data) => {
        return res.status(200).json({
          status: 200,
          message: "Book updated successfully",
          data: data,
        })
      })
      .catch((error) => {
        return res.status(500).json({
          status: 500,
          message: error.message,
        })
      })
  }

  static async deleteBook(req, res) {
    const id = await Book.findById(req.params.id)
    if (!id)
      return res.status(404).json({
        status: 404,
        message: "Book not found",
      })
    await Book.findByIdAndDelete(id)
      .then((data) => {
        return res.status(200).json({
          status: 200,
          message: "Book deleted successfully",
          data: data,
        })
      })
      .catch((error) => {
        return res.status(500).json({
          status: 500,
          message: error.message,
        })
      })
  }
}
