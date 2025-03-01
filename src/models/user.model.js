import mongoose , { Schema } from 'mongoose';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
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
    },
    refreshToken:{
        type:String
    }

},{timestamps:true})



//mongo DB has many events like save, update, delete etc.
//pre is an event that runs before the save event
//this function will run before the save event
//but keep in mind that we cant use arrow function here because we know does not have reference of this
//so it may cause error
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10)
    next()
})
userSchema.methods.isPasswordCorrect = async function(password){ //this function will give us a boolean value
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        phoneNumber:this.phoneNumber,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id, //this is coming from database
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }   
    )
}


export const User = mongoose.model('User', userSchema);