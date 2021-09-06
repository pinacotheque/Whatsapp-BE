import mongoose from "mongoose"

const { Schema, model } = mongoose

const UserSchema = new Schema(
  {
   name: {
      type: String,
      required: true,
    },
    surname:{
      type: String,
      required: true,
    },
    email:{
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "",
    }    
  },
  {
    timestamps: true,
  }
)

export default model("User", UserSchema)