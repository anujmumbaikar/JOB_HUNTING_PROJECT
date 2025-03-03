import { Router } from "express";
import { applyJob,getAppliedJobs,getApplicants,updateApplicationStatus } from "../controllers/application.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()
router.route("/applyJob/:id").post(verifyJWT,applyJob)
router.route("/getAppliedJobs").get(verifyJWT,getAppliedJobs)
router.route("/:id/applicants").get(verifyJWT,getApplicants)
router.route("/updateApplicationStatus/:id").put(verifyJWT,updateApplicationStatus)

export default router