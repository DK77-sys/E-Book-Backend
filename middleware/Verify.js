import jwt from "jsonwebtoken"

export default class Verify {
  static async verifyToken(req, res, next) {
    const bearerHeader = req.headers["authorization"]
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ")
      const bearerToken = bearer[1]
      req.token = bearerToken
      jwt.verify(bearerToken, process.env.JWT_SECRET_KEY, (err, data) => {
        if (err)
          return res.status(403).json({
            status: 403,
            message: "Forbidden",
          })
        req.email = data.email
        next()
      })
    } else {
      return res.status(403).json({
        status: 403,
        message: "You must login before access this page",
      })
    }
  }
}
