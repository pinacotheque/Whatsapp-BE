import { Router } from "express"
import createError from "http-errors"
import ExampleModel from "./schema.js"

const examplesRouter = Router()

examplesRouter.get("/", async (req, res, next) => {
  try {

  } catch (error) {
    console.log(error)
    next(error)
  }
})

examplesRouter.get("/:id", async (req, res, next) => {
  try {

  } catch (error) {
    next(error)
  }
})

examplesRouter.post("/", async (req, res, next) => {
  try {
  } catch (error) {
    next(error)
  }
})

examplesRouter.put("/:id", async (req, res, next) => {
  try {

  } catch (error) {
    next(error)
  }
})

examplesRouter.delete("/:id", async (req, res, next) => {
    try {
    } catch (error) {
      next(error)
    }
  }
)

export default examplesRouter