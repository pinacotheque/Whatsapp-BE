import { Router } from "express"
import createError from "http-errors"
import { uploadOnCloudinaryPost } from "../../lib/cloudinary.js"
import MessageModel from "./schema.js"

const messagesRouter = Router()

messagesRouter.post("/", async (req, res, next) => {
  try {
    const newMessage = new MessageModel(req.body)
    const savedMessage = await newMessage.save()
    res.send(savedMessage)
  } catch (error) {
    console.log(error)
    next(createError(500, 'Message cannot be posted'))
  }
})

/* ***************GET ALL MESSAGES OF SPECIFIC ROOM */

messagesRouter.get("/:roomId", async (req, res, next) => {
  try {
    const roomId = req.params.roomId
    const messages = await MessageModel.find({
      roomId: roomId
    }).populate("sender")
    if(messages){
      res.send(messages)
    }else{
      next(createError(404, `messages with chatId: ${roomId} not found`))
    }
  } catch (error) {
    next(createError(500, 'Messages not found'))
  }
})

messagesRouter.post("/:messageId/postImage", uploadOnCloudinaryPost, async (req, res, next) => {
  try {
    const messageId = req.params.messageId
    const newImage = { image: req.file.path}
    const updatedImage = await MessageModel.findByIdAndUpdate(messageId, newImage, 
      {
      new:true
  })
  if(!updatedImage){
      return next(createError(404, "message not found"))
  }else{
      res.send(updatedImage)
  }
  } catch (error) {
    next(error)
  }
})

messagesRouter.put("/:messageId", async (req, res, next) => {
  try {
    const messageId = req.params.messageId
    const editMessage = await MessageModel.findByIdAndUpdate(messageId, req.body, {
      new: true,
      runValidators: true,
    })
    if (editMessage) {
      res.send(editMessage)
    } else {
      next(createError(404, `message with id: ${messageId} not found`))
    } 
  } catch (error) {
    next(error)
  }
})

messagesRouter.delete("/:messageId", async (req, res, next) => {
    try {
      const messageId = req.params.messageId
      const deletedMessage = await MessageModel.findByIdAndDelete(messageId)
      if(deletedMessage){
        res.status(204).send()
      }else{
        next(createError(404, `message with id: ${messageId} not found`))
      }
    } catch (error) {
      next(error)
    }
  }
)

export default messagesRouter