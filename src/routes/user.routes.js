import { Router } from "express";
import { register,login,logout,updateProfile } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()
router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").post(verifyJWT(),logout)
router.route("/updateProfile").put(verifyJWT(),updateProfile)
export default router