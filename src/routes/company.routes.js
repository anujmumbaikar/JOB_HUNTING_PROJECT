import { Router } from "express";
import { registerCompany, getCompany, updateCompany, getCompanyById } from "../controllers/company.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/registerCompany").post(verifyJWT('recruiter'), registerCompany);
router.route("/getCompanies").get(verifyJWT(), getCompany);
router.route("/getCompany/:id").get(verifyJWT(), getCompanyById);
router.route("/updateCompany/:id").put(verifyJWT('recruiter'), updateCompany);

export default router;