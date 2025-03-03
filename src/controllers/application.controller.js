import { Application } from "../models/application.model.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/AsyncHandler.js";
import {Job} from "../models/job.model.js"
import {User} from "../models/user.model.js"

const applyJob = asyncHandler(async (req, res) => {
    const jobId = req.params.id;
    const applicantId = req.user?._id; 
    //what does ? do?
    //it is called optional chaining means if user is not present then it will not throw error
    //it will return undefined
    if (!applicantId) {
        throw new ApiError(400, "User not found");
    }
    const existingApplication = await Application.findOne({
        $or:[
            {job:jobId,applicant:applicantId},
        ]
    })
    if (existingApplication) {
        throw new ApiError(400, "Application already exists");
    }
    const job = await Job.findById(jobId);
    if (!job) {
        throw new ApiError(404, "Job not found");
    }
    const application = await Application.create({
        job:jobId,
        applicant:applicantId
    });
    job.applications.push(application._id);
    await job.save();
    return res.status(201).json(new ApiResponse(201, application, "Application created successfully"));
})

const getAppliedJobs = asyncHandler(async (req, res) => {
    const applicantId = req.user?._id;
    if (!applicantId) {
        throw new ApiError(400, "User not found");
    }
    const applications = await Application.find({applicant:applicantId}).sort({createdAt:-1}).populate({
        path:'job', 
        populate:{
            path:'company',
        }
    }).populate('applicant','name email');
    if (applications.length === 0) {
        throw new ApiError(404, "No applications found");
    }
    return res.status(200).json(new ApiResponse(200, applications, "Applications fetched successfully"));
})

const getApplicants = asyncHandler(async (req, res) => {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
        path:'applications',
        sort:{createdAt:-1}, //sort in asending order
        populate:{
            path:'applicant',
            select:'fullname email'
        }
    })
    if (!job) {
        throw new ApiError(404, "Job not found");
    }
    return res.status(200).json(new ApiResponse(200, job, "Applicants fetched successfully"));
    
})
const updateApplicationStatus = asyncHandler(async (req, res) => {
    const {status} = req.body;
    const applicationId = req.params.id;
    if(!status){
        throw new ApiError(400,"Status is required");
    }
    const application = await Application.findByIdAndUpdate(
        applicationId,
        {
            $set:{status:status.toLowerCase()}
        },
        {new:true}
    )
    if(!application){
        throw new ApiError(404,"Application not found");
    }
    return res.status(200).json(new ApiResponse(200,application,"Application updated successfully"));
})
export { applyJob, getAppliedJobs, getApplicants, updateApplicationStatus };

