import mongoose from "mongoose"

const { Schema, model } = mongoose

const ChatSchema = new Schema(
  {
   users: {
      type: Array,
    },  
  },
  {
    timestamps: true,
  }
)

export default model("Chat", ChatSchema)