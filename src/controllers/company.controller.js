import {asyncHandler} from '../utils/AsyncHandler.js';
import {Company} from '../models/company.model.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import {User} from '../models/user.model.js'

const registerCompany = asyncHandler(async (req, res) => {
    const { companyName } = req.body;
    if (!companyName) {
        throw new ApiError(400, "Company name is required");
    }
    const exists = await Company.findOne({ companyName });
    if (exists) {
        throw new ApiError(400, "Company already exists");
    }
    const company = await Company.create({
        companyName,
        createdBy: req.user._id,
    });
    const createdCompany = await Company.findById(company._id).populate("createdBy","fullname email");
    //what populate in general do?
    //populate is used to get the data of the referenced field
    //here createdBy is a referenced field
    //so we are populating createdBy field
    //and we are selecting only fullname and email
    if (!createdCompany) {
        throw new ApiError(500, "Company not created");
    }
    return res.status(201).json(new ApiResponse(201, createdCompany, "Company created successfully"));
});
const getCompany = asyncHandler(async (req, res) => {
    //loged in user can see all companies they created
    const user = await User.findById(req.user._id);
    if(!user){
        throw new ApiError(400, 'User not found');
    }
    const companies = await Company.find({createdBy:user._id}).populate('createdBy','fullname email');
    if (companies.length === 0) {
        throw new ApiError(404, "No companies found for this user");
    }
    return res.status(200).json(new ApiResponse(200, companies, "Companies fetched successfully"));
})
const getCompanyById = asyncHandler(async (req, res) => {
    const companyId  = req.params.id;  // this is a string so it will not accept {companyId} directly
    if (!companyId) {
        throw new ApiError(400, "Company id is required");
    }
    const company = await Company.findById(companyId).populate("createdBy","fullname email");
    if (!company) {
        throw new ApiError(404, "Company not found");
    }
    return res.status(200).json(new ApiResponse(200, company, "Company fetched successfully"));
})
const updateCompany = asyncHandler(async (req, res) => {
    const {companyName,description,website,location} = req.body;
    const companyexists = await Company.findByIdAndUpdate(
        req.params.id,
        {
           $set:{
               companyName,
               description,
               website,
               location
           }
        },
        {
            new:true
        }
    )
    if(!companyexists){
        throw new ApiError(400, 'Company not found');
    }
    return res.status(200).json(new ApiResponse(200, companyexists, 'Company updated successfully'));
})
export {registerCompany, getCompany, getCompanyById, updateCompany}