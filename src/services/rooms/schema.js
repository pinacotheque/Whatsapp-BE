import mongoose from "mongoose"
import { MessageSchema } from "../messages/schema.js"
import MessageModel from "../messages/schema.js"

const { Schema, model } = mongoose

const RoomSchema = new Schema(
  {
    name:{
      type: String
    },
    description:{
      type: String
    },
    roomAvatar:{
      type: String,
      default:"https://www.vabali.de/online/wp-content/uploads/blank-avatar-profile.png"
    },
    roomBackground:{
      type: String,
    },
    members:[{
      type: Schema.Types.ObjectId,
      ref:"User",
      required: true
    }]
    ,
    chatHistory:{
      type: [MessageSchema],
      required: true,
      default:[]
    },
  },
  {
    timestamps: true,
  }
)

RoomSchema.pre('findOneAndDelete',async function(next) {
  try {
    let deletedRoom = this.getQuery()._id
    console.log(deletedRoom);
    if(deletedRoom){
      await MessageModel.deleteMany({"roomId": deletedRoom})
    }
    next()
  } catch (error) {
    console.log(error);
  }
})

export default model("Room", RoomSchema)