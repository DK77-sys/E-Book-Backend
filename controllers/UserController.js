import User from "../models/UserModel.js"

export default class UserController {
  static async getAllUsers(req, res) {
    let denied = {
      __id: false,
      __v: false,
      refreshToken: false,
      password: false,
      updatedAt: false,
    }

    await User.find({}, denied)
      .then((data) => {
        if (data.length === 0)
          return res.status(404).json({
            status: 404,
            message: "Users data empty",
          })
        return res.status(200).json({
          status: 200,
          message: "Users retrieved successfully",
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

  static async getUserById(req, res) {
    let denied = {
      __id: false,
      __v: false,
      refreshToken: false,
      password: false,
      updatedAt: false,
    }
    await User.findById(req.params.id, denied)
      .then((data) => {
        return res.status(200).json({
          status: 200,
          message: "User retrieved successfully",
          data: data,
        })
      })
      .catch((error) => {
        return res.status(404).json({
          status: 404,
          message: "User not found",
        })
      })
  }
}
