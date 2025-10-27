import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getAllJobs, getJobById } from "../controller/jobController.js";
const router = express.Router();

router.get('/all-jobs', getAllJobs);
router.get('/job/:id', getJobById);

export default router;