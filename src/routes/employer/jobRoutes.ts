import express from "express";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { authorizeRoles } from "../../middleware/authorizeRoles.js";
import { EMPLOYER } from "../../utils/constants.js";
import { validate } from "../../middleware/validate.js";
import { createJobSchema } from "../../validators/jobValidator.js";
import { createJob, getUserJobs } from "../../controller/employer/jobController.js";

const router = express.Router();

router.post('/create-job', authMiddleware, validate(createJobSchema), authorizeRoles(EMPLOYER), createJob)
router.get('/all-jobs', authMiddleware, authorizeRoles(EMPLOYER), getUserJobs)

export default router;