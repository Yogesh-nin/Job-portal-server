import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "./generated/prisma/index.js";
import authRoute from './routes/authRoutes.js'
import userRoute from './routes/userProfileRoutes.js'
import publicJobRoute from './routes/jobRoutes.js'
import jobRoute from './routes/employer/jobRoutes.js'
import companyRoute from './routes/employer/companyRoute.js'
import imageCompressRoute from './routes/image-compress.js'
import industryRoute from './routes/industry.js'
import { errorHandler } from "./middleware/errorHandler.js";


dotenv.config();

const app = express();
// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello from Express + TypeScript + CORS + dotenv");
});

app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/jobs', publicJobRoute)
app.use('/api/industry', industryRoute)

app.use('/api/employer/job', jobRoute)
app.use('/api/employer/company', companyRoute);
app.use('/api', imageCompressRoute);

const PORT = process.env.PORT || 5000;
export const prisma = new PrismaClient();
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
