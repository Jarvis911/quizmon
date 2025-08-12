/*
  Warnings:

  - You are about to drop the `QuestionMedia` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."QuestionMedia" DROP CONSTRAINT "QuestionMedia_id_fkey";

-- DropTable
DROP TABLE "public"."QuestionMedia";

-- CreateTable
CREATE TABLE "public"."QuizMedia" (
    "id" SERIAL NOT NULL,
    "type" "public"."MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "startTime" INTEGER,
    "duration" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "quizId" INTEGER NOT NULL,

    CONSTRAINT "QuizMedia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."QuizMedia" ADD CONSTRAINT "QuizMedia_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "public"."Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
