import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {Job} from '../models/job.model.js'
import {User} from '../models/user.model.js'
import {asyncHandler} from '../utils/AsyncHandler.js'

const createJob = asyncHandler(async (req, res) => {
    const {title, description, requirements, salary, location, jobType, position, companyId, experience} = req.body;
    if(!title || !description || !requirements || !salary || !location || !jobType || !position || !companyId || !experience){
        throw new ApiError(400, 'Please provide all fields');
    }
    const job = await Job.create({
        title,
        description,
        requirements,
        salary,
        location,
        jobType,
        position,
        experience,
        company: companyId,
        createdBy: req.user._id
    })
    const createdJob = await Job.findById(job._id).populate({
        path: 'createdBy',
        select: '-password -refreshToken' // Exclude sensitive fields
    }).populate("company","companyName description location website"); // Populate all fields
    if(!createdJob){
        throw new ApiError(500, 'Job not created');
    }
    return res.status(201).json(new ApiResponse(201,createdJob,'Job created successfully'));

})

const getAllJobs = asyncHandler(async(req,res)=>{
    const keyword = req.query.keyword || "";
    const query = {
        $or:[
            {title:{$regex:keyword, $options:'i'}},
            {description:{$regex:keyword, $options:'i'}},
        ]
    }
    const jobs = await Job.find(query)
    if(!jobs){
        throw new ApiError(404, 'No jobs found');
    }
    //i want all info of company and createby
    //i want all data from poplate nnot only fullname,and email
    const allJobs = await Job.find(query).populate({
        path: 'createdBy',
        select: '-password -refreshToken' // Exclude sensitive fields
    }).populate("company"); // Populate all fields
    if(!allJobs){
        throw new ApiError(404, 'No jobs found');
    }
    return res.status(200).json(new ApiResponse(200,allJobs,'Jobs found successfully'));

})


const getJobById = asyncHandler(async(req,res)=>{
    const jobId = req.params.id;
    const job = await Job.findById(jobId)
    if(!job){
        throw new ApiError(404, 'Job not found');
    }
    return res.status(200).json(new ApiResponse(200,job,'Job found successfully'));
})


const getAdminJobs = asyncHandler(async(req,res)=>{
    const adminId = req.user?._id;
    if(!adminId){
        throw new ApiError(400, 'Admin not found');
    }
    const jobs = await Job.find({createdBy:adminId});
    if(!jobs){
        throw new ApiError(404, 'No jobs found');
    }

    return res.status(200).json(new ApiResponse(200,jobs,'Jobs found successfully'));
})


export {createJob,getAllJobs,getJobById,getAdminJobs}
