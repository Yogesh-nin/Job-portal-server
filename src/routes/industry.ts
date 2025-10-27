import express from "express";
import { createIndustry, getIndustries, getIndustryById } from "../controller/employer/industryController.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";
import { ADMIN, EMPLOYER } from "../utils/constants.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/', getIndustries);
router.get("/:id", getIndustryById);

router.post('/', authMiddleware, authorizeRoles(EMPLOYER, ADMIN), createIndustry)

export default router;