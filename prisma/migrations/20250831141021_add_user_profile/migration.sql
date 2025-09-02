-- CreateTable
CREATE TABLE "public"."UserProfile" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "resume_url" TEXT,
    "experience" TEXT,
    "education" TEXT,
    "skills" TEXT[],
    "linkedin" TEXT,
    "portfolio" TEXT,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_user_id_key" ON "public"."UserProfile"("user_id");

-- AddForeignKey
ALTER TABLE "public"."UserProfile" ADD CONSTRAINT "UserProfile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
