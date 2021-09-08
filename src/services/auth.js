import { Router } from "express"
import createError from "http-errors"
import { JWTAuthMiddleware } from "../auth/middlewares.js"
import { JWTAuthenticate, refreshTokenFunc } from "../auth/tools.js"
import UserModel from "./users/schema.js"

const authRouter = Router()

authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.checkCredentials(email, password)
    if (user) {
      const { accessToken, refreshToken } = await JWTAuthenticate(user)
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
      })
      res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false })
      res.redirect(`/users/me`)
    } else {
      next(createError(401, "Credentials are not valid"))
    }
  } catch (error) {
    next(error)
  }
})

authRouter.post("/register", async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await UserModel.findOne({ email: email })
    if (user) {
      next(createError(403, "Email already exists"))
    } else {
      const newUser = new UserModel(req.body)
      const addedUser = await newUser.save()
      const { accessToken, refreshToken } = await JWTAuthenticate(addedUser)
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
      })
      res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: false })
      res.redirect(`${process.env.BACKEND_URL}/users/me`)
    }
  } catch (error) {
    next(error)
  }
})

authRouter.get("/refreshToken", async (req, res, next) => {
    try {
      const refreshTokenOld = req.cookies.refreshToken
      const { accessToken, refreshToken } = await refreshTokenFunc(refreshTokenOld)
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
      })
      res.cookie("refreshToken", refreshToken, { 
        httpOnly: true, 
        secure: false 
      })
      res.redirect(`${process.env.BACKEND_URL}/users/me`)
    } catch (error) {
      next(error)
    }
  })

  authRouter.post("/logout", JWTAuthMiddleware, async (req, res, next) => {
    try {
      req.user.refreshToken = null
      await req.user.save()
      res.clearCookie("accessToken").send('you have successfully logged out!')
    } catch (error) {
      next(error)
    }
  })

export default authRouter