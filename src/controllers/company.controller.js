import {asyncHandler} from '../middlewares/asyncHandler.js';
import {Company} from '../models/company.model.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'

const registerCompany = asyncHandler(async (req, res, next) => {
    const {} = req.body;
})