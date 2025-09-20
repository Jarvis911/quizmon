-- AlterTable
ALTER TABLE "public"."QuizRating" ALTER COLUMN "text" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "MatchResult_userId_idx" ON "public"."MatchResult"("userId");

-- CreateIndex
CREATE INDEX "MatchResult_matchId_idx" ON "public"."MatchResult"("matchId");
