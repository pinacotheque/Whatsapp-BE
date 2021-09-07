import { CloudinaryStorage } from "multer-storage-cloudinary"
import { v2 as cloudinary } from "cloudinary"
import multer from "multer"

const cloudinaryStorage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:"Whatsapp/avatar"
    }
})

const cloudinaryStoragePost = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:"Whatsapp/post"
    }
})

const cloudinaryStorageBackground = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:"Whatsapp/background"
    }
})

const cloudinaryStorageRoomAvatar = new CloudinaryStorage({
    cloudinary,
    params:{
        folder:"Whatsapp/roomAvatar"
    }
})

export const uploadOnCloudinary = multer({
    storage: cloudinaryStorage
}).single("avatar")

export const uploadOnCloudinaryPost = multer({
    storage: cloudinaryStoragePost
}).single("post")

export const uploadOnCloudinaryRoomBackground = multer({
    storage: cloudinaryStorageBackground
}).single("background")

export const uploadOnCloudinaryRoomAvatar = multer({
    storage: cloudinaryStorageRoomAvatar
}).single("roomAvatar")