-- CreateTable
CREATE TABLE "profile_analysis" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "analysis" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profile_analysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profile_analysis_userId_key" ON "profile_analysis"("userId");

-- CreateIndex
CREATE INDEX "profile_analysis_userId_idx" ON "profile_analysis"("userId");

-- AddForeignKey
ALTER TABLE "profile_analysis" ADD CONSTRAINT "profile_analysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
