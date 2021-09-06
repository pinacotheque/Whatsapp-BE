import mongoose from "mongoose"

const { Schema, model } = mongoose

const MessageSchema = new Schema(
  {
   chatId: {
      type: String,
    },
    sender:{
      type: String,
    },
    message:{
      type: String,
    },   
  },
  {
    timestamps: true,
  }
)

export default model("Message", MessageSchema)