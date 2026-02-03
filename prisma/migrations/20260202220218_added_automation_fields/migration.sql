-- CreateTable
CREATE TABLE "automation_settings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "competitors" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "writingStyle" TEXT NOT NULL DEFAULT 'let ai decide',
    "scriptLanguage" TEXT NOT NULL DEFAULT 'English',
    "captionLanguage" TEXT NOT NULL DEFAULT 'English',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "automation_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "automation_settings_userId_key" ON "automation_settings"("userId");

-- AddForeignKey
ALTER TABLE "automation_settings" ADD CONSTRAINT "automation_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
