import RoomModel from "../rooms/schema.js"
import createError from "http-errors"

export const getSingleMessage = async (req, res, next) => {
    const messageId = req.params.messageId
    const roomId = req.params.roomId
    const updatedMessage = await RoomModel.findById(roomId,{
        chatHistory:{
          $elemMatch: {
            _id: messageId
          }
        },
        _id: 0
      })
    if(updatedMessage){
        res.send(updatedMessage.chatHistory[0])
        next()
    }else{
        next(createError(404, `message with id: ${messageId}`))
    }
}