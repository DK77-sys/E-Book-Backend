import mongoose from "mongoose"

const { Schema, model } = mongoose

class UserSchema extends Schema {
  constructor() {
    super(
      {
        email: {
          type: String,
          required: true,
          unique: true,
        },
        username: {
          type: String,
          required: true,
        },
        password: {
          type: String,
          required: true,
        },
        refreshToken: {
          type: String,
        },
        // isAdmin: {
        //   type: Boolean,
        //   default: false,
        // },
      },
      { timestamps: true }
    )
  }
}

export default model("User", new UserSchema())
