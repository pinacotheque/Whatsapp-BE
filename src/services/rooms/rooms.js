import { Router } from "express"
import createError from "http-errors"
import { uploadOnCloudinaryRoomAvatar, uploadOnCloudinaryRoomBackground } from "../../lib/cloudinary.js"
import RoomModel from "./schema.js"

const roomsRouter = Router()

/* roomsRouter.get("/", async (req, res, next) => {
  try {

  } catch (error) {
    console.log(error)
    next(error)
  }
}) */

/**************GET ALL ROOMS OF A SPECIFIC USER**********************/

roomsRouter.get("/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId
    const rooms = await RoomModel.find({
      members: {
        $in: [userId]
      }
    }).populate("members")
    if(rooms){
      res.send(rooms)
    }else{
      next(createError(404, `user with userId: ${userId} is not assigned to any room`))
    }
  } catch (error) {
    next(error)
  }
})

/***************CREATE A NEW ROOM****************************/

roomsRouter.post("/", async (req, res, next) => {
  try {
    if(req.body.members.length > 2){
      const newRoom = new RoomModel(req.body)
      const savedRoom = await newRoom.save()
      res.send(savedRoom)
    }else{
      const oneToOneRoom = new RoomModel({
        ...req.body,
        name:""
      })
      const oneToOnesavedRoom = await oneToOneRoom.save()
      res.send(oneToOnesavedRoom)
    }
  } catch (error) {
    next(createError(500, "can't post to rooms"))
  }
})

/****************UPLOAD ROOM AVATAR******************************/

roomsRouter.post("/:roomId/uploadAvatar", uploadOnCloudinaryRoomAvatar, async (req, res, next) => {
    try {
      const roomId = req.params.roomId
      const newImage = { roomAvatar: req.file.path}
      const updatedImage = await RoomModel.findByIdAndUpdate(roomId, newImage, 
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
  }
)

/****************UPLOAD ROOM BACKGROUND IMAGE******************************/

roomsRouter.post("/:roomId/uploadBackground", uploadOnCloudinaryRoomBackground, async (req, res, next) => {
  try {
    const roomId = req.params.roomId
      const newImage = { roomBackground: req.file.path}
      const updatedImage = await RoomModel.findByIdAndUpdate(roomId, newImage, 
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
}
)

/****************EDIT ROOM DETAILS******************************/

roomsRouter.put("/:roomId", async (req, res, next) => {
  try {
    const roomId = req.params.roomId
    const editRoom = await RoomModel.findByIdAndUpdate(roomId, req.body, {
      new: true,
      runValidators: true,
    })
    if (editRoom) {
      res.send(editRoom)
    } else {
      next(createError(404, `room with id: ${roomId} not found`))
    } 
  } catch (error) {
    next(error)
  }
})

/****************DELETE ROOM******************************/

roomsRouter.delete("/:roomId", async (req, res, next) => {
  try {
    const roomId = req.params.roomId
    const deletedRoom = await RoomModel.findByIdAndDelete(roomId)
    if(deletedRoom){
      res.status(204).send()
    }else{
      next(createError(404, `room with id: ${roomId} not found`))
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default roomsRouter