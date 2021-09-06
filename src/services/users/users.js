import { Router } from "express"
import createError from "http-errors"
import UserModel from "./schema.js"

const usersRouter = Router()

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find({})
    res.send(users)
  } catch (error) {
    console.log(error)
    next(createError(500, "Error in getting users"))
  }
})

/***************GET ONLY YOUR USER DETAILS*******************/

usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.user)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

usersRouter.get("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId
    const user = await UserModel.findById(userId)
    if(user){
      res.send(user)
    }else{
      next(createError(404, `user with id: ${userId} not found`))
    }
  } catch (error) {
    next(createError(500, "Error in getting user"))
  }
})

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body)
    const savedUser = await newUser.save()
    res.send(savedUser)
  } catch (error) {
    next(createError(500, "Error in posting user"))
  }
})

usersRouter.put("/:id", async (req, res, next) => {
  try {

  } catch (error) {
    next(createError(500, "Error in editing user"))
  }
})

/***************DELETE USER DETAILS BY ID*******************/

usersRouter.delete("/:userId", async (req, res, next) => {
    try {
      const userId = req.params.userId
      const deletedUser = await UserModel.findByIdAndDelete(userId)
      if(deletedUser){
        res.status(204).send()
      }else {
        next(createError(404, `user with id ${userId} not found`))
      }
    } catch (error) {
      next(createError(500, "Error in deleting user"))
    }
  }
)

export default usersRouter