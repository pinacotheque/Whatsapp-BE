import jwt from "jsonwebtoken"
import UserModel from "../services/users/schema.js"

export const JWTAuthenticate = async (user) => {
  const accessToken = await generateJWT({ _id: user._id })
  const refreshToken = await generateRefreshJWT({ _id: user._id })
  user.refreshToken = refreshToken
  await user.save()
  return { accessToken, refreshToken }
}

const generateJWT = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(payload, 
      process.env.JWT_SECRET, 
      { expiresIn: "15m" }, 
      (err, token) => {
      if (err) reject(err)
      resolve(token)
    })
  )

const generateRefreshJWT = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) reject(err)
        resolve(token)
      }
    )
  )

export const verifyJWT = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) reject(err)
      resolve(decodedToken)
    })
  )

const verifyRefresh = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decodedToken) => {
      if (err) {
        reject(err)
      }
      resolve(decodedToken)
    })
  )

export const refreshTokenFunc = async (actualRefreshToken) => {
  try {
    const data = await verifyRefresh(actualRefreshToken)
    const user = await UserModel.findById(data._id)
    if (!user) throw new Error("User is not found")
    if (actualRefreshToken === user.refreshToken) {
      const { accessToken, refreshToken } = await JWTAuthenticate(user)
      return { accessToken, refreshToken }
    } else {
      throw new Error("Token not valid!")
    }
  } catch (error) {
    throw new Error("Token not valid!")
  }
}
