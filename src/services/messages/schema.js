import mongoose from "mongoose"

const { Schema, model } = mongoose

export const MessageSchema = new Schema(
  {
   roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true
    },
    sender:{
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    message:{
      type: String,
    },
    image:{
      type: String
    },   
  },
  {
    timestamps: true,
  }
)

export default model("Message", MessageSchema)