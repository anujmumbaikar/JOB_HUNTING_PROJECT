import {asyncHandler} from '../utils/AsyncHandler.js';
import {User} from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';

const generateAccessAndRefreshTokens = async(userID)=>{
    const user = await User.findById(userID)
    if(!user){
        throw new ApiError(400,"something went wrong")
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken
    await user.save({validateBeforeSave:false}) //why we do this??
    // we do this because we dont want to validate the password and other fields again
    // we just want to update the refresh token
    return {accessToken,refreshToken}

}
const register = asyncHandler(async(req,res)=>{
    const {fullname,email,password,phoneNumber,role} = req.body;
    if(
        [fullname,email,password,phoneNumber,role].some((field)=> field?.trim() === "")
    ){
        throw new ApiError(400,'Please fill all the fields');
    }
    const exists = await User.findOne({
        $or:[{phoneNumber},{email}]
    })
    if(exists){
        throw new ApiError(400,'User already exists');
    }
    const user = await User.create({
        fullname,
        email,
        password,
        phoneNumber,
        role
    })
    const createdUser = await User.findById(user._id).select('-password -refreshToken');
    if(!createdUser){
        throw new ApiError(500,'User not created');
    }
    return res.status(200).json(new ApiResponse(200,createdUser,"User created successfully"))
})

const login = asyncHandler(async (req,res)=>{
    const {email,password,phoneNumber,role} = req.body;
    if(!email && !phoneNumber){
        throw new ApiError(400,"Pls enter email or phone number")
    }
    if(!role){
        throw new ApiError(400,"Pls enter role")
    }
    if(!password){
        throw new ApiError(400,"Pls enter password")
    }
    const user = await User.findOne({
        $or:[{email},{phoneNumber}]
    })
    if(!user){
        throw new ApiError(400,"User Not Found!!")
    }
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(400,"password is incorrect")
    }
    if(role !== user.role){
        throw new ApiError(400,"Account doesnt exist for this role")
    }
    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id)
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    const options = {
        httpOnly:true,
        secure:true,
    }
    return res.status(200).cookie('refreshToken',refreshToken,options).cookie('accessToken',accessToken,options)
    .json(new ApiResponse(200,{user:loggedInUser,accessToken,refreshToken},"User logged in successfully"))

})

const logout = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:""
            }
        },
        {new:true}
    )
    const options = {
        httpOnly:true,
        secure:true,
    }
    return res.status(200).clearCookie('refreshToken',options).clearCookie('accessToken',options)
    .json(new ApiResponse(200,{},"User logged out successfully"))
})

const updateProfile = asyncHandler(async(req,res)=>{
    const {fullname,phoneNumber,bio,skills} = req.body;
    if(!fullname || !phoneNumber || !bio || !skills){
        throw new ApiError(400,"Please fill all the fields")
    }
    const skillsArray = Array.isArray(skills) ? skills : skills.split(",").map(skill => skill.trim());
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                fullname,
                phoneNumber,
                "profile.bio": bio,
                "profile.skills": skillsArray,
            }
        },
        {new:true}
    )
    return res
    .status(200)
    .json(new ApiResponse(200,updatedUser,"profile updated successfully"))
})

export {register,login,logout,updateProfile}


