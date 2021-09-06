import mongoose from "mongoose"

const { Schema, model } = mongoose

const ExampleSchema = new Schema(
  {
  /*   name: {
      type: String,
      required: true,
    }, */
  },
  {
    timestamps: true,
  }
)

export default model("Example", ExampleSchema)