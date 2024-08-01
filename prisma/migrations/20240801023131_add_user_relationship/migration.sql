-- CreateTable
CREATE TABLE "UserRelationship" (
    "sourceId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "follows" BOOLEAN NOT NULL,

    CONSTRAINT "UserRelationship_pkey" PRIMARY KEY ("sourceId","targetId")
);
