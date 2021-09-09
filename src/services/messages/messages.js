import { Router } from "express"
import createError from "http-errors"
import { uploadOnCloudinaryPost } from "../../lib/cloudinary.js"
import RoomModel from "../rooms/schema.js"
import { getSingleMessage } from "./shared.js"

const messagesRouter = Router()

/****************POST A MESSAGE******************************/

messagesRouter.post("/:roomId",uploadOnCloudinaryPost, async (req, res, next) => {
  try {
    const roomId = req.params.roomId
    const newMessage = {
      ...req.body,
      image: req.file?.path && req.file.path,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const savedMessage = await RoomModel.findByIdAndUpdate(roomId,{
      $push:{
        chatHistory: newMessage
      }
    },{
      new: true,
      runValidators: true
    })
    if(savedMessage){
      res.status(201).send(savedMessage)
    }else{
      res.status(404).send(`room with id: ${roomId} not found`)
    }
  } catch (error) {
    console.log(error)
    next(createError(500, 'Message cannot be posted'))
  }
})

/* ***************GET ALL MESSAGES OF SPECIFIC ROOM *****************/

messagesRouter.get("/:roomId", async (req, res, next) => {
  try {
    const roomId = req.params.roomId
    const room = await RoomModel.findById(roomId).populate("chatHistory.sender")
    if(room){
        res.send(room)
    }else{
        res.status(404).send(`room with id: ${roomId} not found`)
    }
  } catch (error) {
    console.log(error);
    next(createError(500, 'Messages not found'))
  }
})

/****************UPLOAD IMAGE TO CHAT******************************/

messagesRouter.post("/:roomId/:messageId/postImage", uploadOnCloudinaryPost, getSingleMessage, async (req, res, next) => {
  try {
    const roomId = req.params.roomId
    const messageId = req.params.messageId
    const newImage = req.file.path
    const toUpdateMessage = await RoomModel.findOneAndUpdate({
      _id: roomId,
      "chatHistory._id": messageId
    },{
      $set: {
        'chatHistory.$.image': newImage
      }
    },{
      new: true
    })
   if(toUpdateMessage){
     res.send(toUpdateMessage)
   }else{
     next(createError(404, `room with id: ${roomId} not found`))
   }
  } catch (error) {
    next(error)
  }
})

/****************EDIT A MESSAGE******************************/

messagesRouter.put("/:roomId/:messageId", async (req, res, next) => {
  try {
    const roomId = req.params.roomId
    const messageId = req.params.messageId

    const body = {}
    for(let key in req.body){
      body[`chatHistory.$.${key}`] = req.body[key]
    }
    body[`chatHistory.$.updatedAt`] = new Date()

    const room = await RoomModel.findOneAndUpdate({
      _id: roomId,
      'chatHistory._id': messageId
    },{
      $set: body
    },{
      new: true,
      runValidators: true
    })
    if(room){
      res.send(room)
    }else{
      res.status(404).send(`room with id: ${roomId} not found`)
    }
  } catch (error) {
    next(error)
  }
})

/****************DELETE A MESSAGE******************************/

messagesRouter.delete("/:roomId/:messageId", getSingleMessage, async (req, res, next) => {
    try {
      const roomId = req.params.roomId
      const messageId = req.params.messageId
      const deletedMessage = await RoomModel.findByIdAndUpdate(roomId,{
        $pull:{
          chatHistory: {
            _id: messageId
          }
        }
      },{
        new: true
      })
      if(deletedMessage){
        res.send(req.body.updatedMessage)
      }else{
        res.status(404).send(`room with id: ${roomId} not found`)
      }
    } catch (error) {
      next(error)
    }
  }
)

export default messagesRouter