import mongoose , { Schema } from 'mongoose';
const userSchema = new Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    role:{
        type:String,
        enum:['student','recruiter'], //field should be either student or recruiter not other than that
        required:true
    },
    profile:{
        bio:{type:String},
        skills:[{type:String}],
        resume:{type:String}, // resume will be stored as a URL
        resumeOriginalName:{type:String},
        company:{
            type:Schema.Types.ObjectId,
            ref:'Company'
        },
        profileImage:{type:String , default:""}, // profile image will be stored as a URL
    }

},{timestamps:true})

export const User = mongoose.model('User', userSchema);