import { Router } from "express"
import createError from "http-errors"
import MessageModel from "./schema.js"

const messagesRouter = Router()

messagesRouter.get("/", async (req, res, next) => {
  try {

  } catch (error) {
    console.log(error)
    next(error)
  }
})

messagesRouter.get("/:id", async (req, res, next) => {
  try {

  } catch (error) {
    next(error)
  }
})

messagesRouter.post("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

messagesRouter.put("/:id", async (req, res, next) => {
  try {

  } catch (error) {
    next(error)
  }
})

messagesRouter.delete("/:id", async (req, res, next) => {
    try {
    } catch (error) {
      next(error)
    }
  }
)

export default messagesRouter