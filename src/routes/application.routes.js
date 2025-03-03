import { Router } from "express";
import { applyJob, getAppliedJobs, getApplicants, updateApplicationStatus } from "../controllers/application.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/applyJob/:id").post(verifyJWT('student'), applyJob);
router.route("/getAppliedJobs").get(verifyJWT('student'), getAppliedJobs);
router.route("/:id/applicants").get(verifyJWT('recruiter'), getApplicants);
router.route("/updateApplicationStatus/:id").put(verifyJWT('recruiter'), updateApplicationStatus);

export default router;