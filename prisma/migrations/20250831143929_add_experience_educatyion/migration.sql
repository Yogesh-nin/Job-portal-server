/*
  Warnings:

  - You are about to drop the column `education` on the `UserProfile` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `UserProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."UserProfile" DROP COLUMN "education",
DROP COLUMN "experience";

-- CreateTable
CREATE TABLE "public"."Experience" (
    "id" UUID NOT NULL,
    "userProfileId" UUID NOT NULL,
    "companyName" TEXT NOT NULL,
    "location" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "description" TEXT,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Education" (
    "id" UUID NOT NULL,
    "userProfileId" UUID NOT NULL,
    "school" TEXT NOT NULL,
    "duration" TEXT,
    "cgpa" DOUBLE PRECISION,
    "description" TEXT,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "public"."User"("id");

-- AddForeignKey
ALTER TABLE "public"."Experience" ADD CONSTRAINT "Experience_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "public"."UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Education" ADD CONSTRAINT "Education_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "public"."UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
