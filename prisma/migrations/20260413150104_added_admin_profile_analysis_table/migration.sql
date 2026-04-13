-- CreateTable
CREATE TABLE "AdminProfileAnalysis" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "instagramUsername" TEXT NOT NULL,
    "analysis" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminProfileAnalysis_pkey" PRIMARY KEY ("id")
);
