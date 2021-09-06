import { Router } from "express"
import createError from "http-errors"
import ChatModel from "./schema.js"

const chatsRouter = Router()

chatsRouter.get("/", async (req, res, next) => {
  try {

  } catch (error) {
    console.log(error)
    next(error)
  }
})

chatsRouter.get("/:id", async (req, res, next) => {
  try {

  } catch (error) {
    next(error)
  }
})

chatsRouter.post("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

chatsRouter.put("/:id", async (req, res, next) => {
  try {

  } catch (error) {
    next(error)
  }
})

chatsRouter.delete("/:id", async (req, res, next) => {
    try {
    } catch (error) {
      next(error)
    }
  }
)

export default chatsRouter