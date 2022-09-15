import User from "../models/UserModel.js"
import joi from "joi"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"

let salt = bcrypt.genSaltSync(10)
dotenv.config()

export default class AuthController {
  static async register(req, res) {
    const schema = joi.object({
      username: joi.string().min(3).max(255).required(),
      email: joi.string().min(3).max(255).required().email(),
      password: joi.string().min(3).max(255).required(),
      password2: joi.string().min(3).max(255).required(),
    })

    const { error } = schema.validate(req.body)
    if (error)
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      })

    const { username, email, password, password2 } = req.body

    if (password !== password2)
      return res.status(400).json({
        status: 400,
        message: "Password doesn't match",
      })

    const user = new User({
      username: username,
      email: email,
      password: bcrypt.hashSync(password, salt),
    })

    await user
      .save()
      .then((data) => {
        return res.status(200).json({
          status: 200,
          message: "Register successfully",
          data: {
            username: data.username,
            email: data.email,
          },
        })
      })
      .catch((error) => {
        return res.status(500).json({
          status: 500,
          message: "Email Already Exist",
        })
      })
  }

  static async login(req, res) {
    const schema = joi.object({
      email: joi.string().required().email(),
      password: joi.string().required(),
    })

    const { error } = schema.validate(req.body)
    if (error)
      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      })

    const { email, password } = req.body

    await User.findOne({ email: email })
      .then(async (data) => {
        if (!data)
          return res.status(404).json({
            status: 404,
            message: "Email not found",
          })

        if (!bcrypt.compareSync(password, data.password))
          return res.status(400).json({
            status: 400,
            message: "Wrong Password",
          })

        const token = jwt.sign(
          { id: data._id, email: data.email, username: data.username },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "1d",
          }
        )

        const refreshToken = jwt.sign(
          { id: data._id, email: data.email, username: data.username },
          process.env.JWT_SECRET_REFRESH_KEY,
          {
            expiresIn: "7d",
          }
        )

        await User.findOne({ email: email }).then((data) => {
          data.refreshToken = refreshToken
          data.save()
        })

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({
          status: 200,
          message: "Login successfully",
          data: {
            credentials: {
              username: data.username,
              email: data.email,
            },
            token: {
              accessToken: token,
              refreshToken: refreshToken,
            },
          },
        })
      })
      .catch((error) => {
        return res.status(500).json({
          status: 500,
          message: error.message,
        })
      })
  }

  static async refreshToken(req, res) {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
      })
    }

    User.findOne({ refreshToken: refreshToken })
      .then((data) => {
        const token = jwt.sign(
          { id: data._id, email: data.email, username: data.username },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "1d",
          }
        )
        return res.status(200).json({
          status: 200,
          message: "Token refreshed",
          data: {
            token: token,
          },
        })
      })
      .catch((error) => {
        return res.status(500).json({
          status: 500,
          message: error.message,
        })
      })
  }

  static async logout(req, res) {
    const user = await User.findById(req.body.id)
    jwt.destroy(accessToken)
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      })
    }
    return res.status(200).json({
      status: 200,
      message: "Logout successfully",
    })
  }
}
