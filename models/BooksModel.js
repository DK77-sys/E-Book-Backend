import mongoose from "mongoose"

const { Schema, model } = mongoose

class BookSchema extends Schema {
  constructor() {
    super(
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        author: {
          type: String,
        },
      },
      { timestamps: true }
    )
  }
}

export default model("Book", new BookSchema())
