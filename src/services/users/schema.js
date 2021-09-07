import mongoose from "mongoose"
import bcrypt from "bcrypt"

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
    username:{
      type: String
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
    status:{
      type: String,
      required: true,
      default:"Hey there! I am using WhatsApp."
    },
    avatar: {
      type: String,
      default: "https://www.vabali.de/online/wp-content/uploads/blank-avatar-profile.png",
    }    
  },
  {
    timestamps: true,
  }
)

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

UserSchema.methods.toJSON = function () {
  const userDocument = this
  const userObject = userDocument.toObject()
  delete userObject.password
  delete userObject.__v
  return userObject
}

UserSchema.statics.checkCredentials = async function (email, password) {
  const user = await this.findOne({ email })
  if (user) {
    const isMatch = await bcrypt.compare(password, user.password)
    if (isMatch) {
      return user
    } else {
      return null
    }
  } else {
    return null
  }
}

UserSchema.static("findUsers", async function (query) {
  const total = await this.countDocuments(query.criteria)
  const users = await this.find(query.criteria, query.options.fields)
  .skip(query.options.skip)
  .limit(query.options.limit)
  .sort(query.options.sort)

  return { total, users }
})


export default model("User", UserSchema)