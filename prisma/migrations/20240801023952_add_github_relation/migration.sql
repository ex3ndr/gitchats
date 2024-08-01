-- CreateTable
CREATE TABLE "GithubRelations" (
    "sourceId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "follows" BOOLEAN NOT NULL,
    "followsAny" BOOLEAN NOT NULL,

    CONSTRAINT "GithubRelations_pkey" PRIMARY KEY ("sourceId","targetId")
);
