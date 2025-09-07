-- CreateEnum
CREATE TYPE "public"."SalaryType" AS ENUM ('HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "public"."JobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'TEMPORARY', 'FREELANCE', 'REMOTE');

-- CreateEnum
CREATE TYPE "public"."JobLevel" AS ENUM ('INTERN', 'ENTRY_LEVEL', 'JUNIOR', 'MID_LEVEL', 'SENIOR', 'LEAD', 'MANAGER', 'DIRECTOR', 'EXECUTIVE');

-- AlterTable
ALTER TABLE "public"."UserProfile" ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "public"."Job" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "jobRole" TEXT NOT NULL,
    "tags" TEXT[],
    "minSalary" DOUBLE PRECISION,
    "maxSalary" DOUBLE PRECISION,
    "salaryType" "public"."SalaryType",
    "education" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "jobType" "public"."JobType" NOT NULL,
    "vacancy" INTEGER,
    "expirationDate" TIMESTAMP(3),
    "jobLevel" "public"."JobLevel",
    "country" TEXT,
    "city" TEXT,
    "isRemote" BOOLEAN NOT NULL,
    "jobBenefits" TEXT[],
    "description" TEXT NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);
