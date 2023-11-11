import express from "express";
import { 
    register, 
    auth, 
    confirm, 
    lostPassword, 
    lostPasswordToken,
    newPassword,
    profile
} from "../controllers/userController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();


router.post("/", register);
router.post("/login", auth);
router.get("/confirm/:token", confirm);
router.post("/lost-password", lostPassword);
router.route("/lost-password/:token").get(lostPasswordToken).post(newPassword);
router.get("/profile", checkAuth, profile);

export default router;