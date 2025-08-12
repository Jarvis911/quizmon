-- AlterTable
ALTER TABLE "public"."Quiz" ALTER COLUMN "description" DROP DEFAULT,
ALTER COLUMN "description" SET DATA TYPE TEXT;
