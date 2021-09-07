import { Router } from "express"
import createError from "http-errors"
import UserModel from "./schema.js"
import { JWTAuthMiddleware } from "../../auth/middlewares.js"
import { uploadOnCloudinary } from "../../lib/cloudinary.js"
import q2m from "query-to-mongo"

const usersRouter = Router()

/***************GET ALL USERS*******************/

usersRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query) 
    const { total, users } = await UserModel.findUsers(query)
    res.send({links: query.links("/users", total), total, users})    
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

/***************GET USER DEATILS BY SPECIFIC ID*******************/

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

/***************EDIT ONLY YOUR USER DEATILS*******************/

usersRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const body = req.user
    body.name = req.body.name ? req.body.name : body.name
    body.surname = req.body.surname ? req.body.surname : body.surname
    body.status = req.body.status ? req.body.status : body.status
    body.username = req.body.username ? req.body.username : body.username
    body.email = req.body.email ? req.body.email : body.email
    body.about = req.body.about ? req.body.about : body.about
    body.avatar = req.body.avatar ? req.body.avatar : body.avatar
    const editUser = await body.save()
    res.send(editUser)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

/***************EDIT USER DEATILS BY ID*******************/

usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId
    const editUser = await UserModel.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    })
    if (editUser) {
      res.send(editUser)
    } else {
      next(createError(404, `user with id: ${userId} not found`))
    } 
  } catch (error) {
    next(createError(500, "Error in editing user"))
  }
})

/***************DELETE ONLY YOUR USER DEATILS*******************/

usersRouter.delete("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    await req.user.deleteOne()
    res.status(204).send()
  } catch (error) {
    console.log(error)
    next(error)
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

/*******************************UPLOAD ON CLOUDINARY*******************************/

usersRouter.post("/me/cover", uploadOnCloudinary, JWTAuthMiddleware, async (req, res, next) => {
  try {
      const userId = req.user._id
      const newAvatar = { avatar: req.file.path}
      const updatedAvatar = await UserModel.findByIdAndUpdate(userId, newAvatar, {
          new:true
      })
      if(!updatedAvatar){
          return next(createError(404, "user not found"))
      }else{
          res.send(updatedAvatar)
      }
  } catch (error) {
      console.log(error);
      next(error)
  }
})

export default usersRouter