import mongoose from "mongoose"

const { Schema, model } = mongoose

export const MessageSchema = new Schema(
  {
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
    createdAt: Date,
    updatedAt: Date   
  }
)

/* export default model("Message", MessageSchema) */