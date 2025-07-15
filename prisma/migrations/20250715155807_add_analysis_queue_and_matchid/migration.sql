-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "matchId" TEXT;

-- CreateTable
CREATE TABLE "AnalysisQueue" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "AnalysisQueue_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AnalysisQueue" ADD CONSTRAINT "AnalysisQueue_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
