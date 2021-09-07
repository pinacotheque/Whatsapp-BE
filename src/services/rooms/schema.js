import mongoose from "mongoose"
import { MessageSchema } from "../messages/schema.js"

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
    members:{
      type: [Schema.Types.ObjectId],
      ref:"User"
    }
  },
  {
    timestamps: true,
  }
)

export default model("Room", RoomSchema)