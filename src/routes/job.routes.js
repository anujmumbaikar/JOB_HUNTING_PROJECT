import { Router } from "express";
import { createJob,getAllJobs,getJobById,getAdminJobs } from "../controllers/job.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()
router.route("/createJob").post(verifyJWT(),createJob)
router.route("/getJobs").get(verifyJWT(),getAllJobs)
router.route("/getJob/:id").get(verifyJWT(),getJobById)
router.route("/getAdminJobs").get(verifyJWT(),getAdminJobs)

export default router