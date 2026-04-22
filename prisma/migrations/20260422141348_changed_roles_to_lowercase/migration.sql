-- AlterEnum: Safely rename ROLES enum values from UPPERCASE to lowercase
-- while preserving all existing rows by converting the data first.

BEGIN;

-- Step 1: Add the new lowercase enum values alongside the old ones
ALTER TYPE "ROLES" ADD VALUE IF NOT EXISTS 'admin';
ALTER TYPE "ROLES" ADD VALUE IF NOT EXISTS 'user';

COMMIT;

-- Step 2: Migrate existing data to the new lowercase values
-- (Must be outside the transaction that added the new enum values)
UPDATE "user" SET "role" = 'admin' WHERE "role"::text = 'ADMIN';
UPDATE "user" SET "role" = 'user'  WHERE "role"::text = 'USER';

-- Step 3: Swap out the old enum for a clean new one (without uppercase variants)
BEGIN;

CREATE TYPE "ROLES_new" AS ENUM ('admin', 'user');

ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "user" ALTER COLUMN "role" TYPE "ROLES_new" USING ("role"::text::"ROLES_new");

ALTER TYPE "ROLES" RENAME TO "ROLES_old";
ALTER TYPE "ROLES_new" RENAME TO "ROLES";

DROP TYPE "ROLES_old";

ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user';

COMMIT;
