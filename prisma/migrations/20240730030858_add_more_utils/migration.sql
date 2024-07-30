-- CreateTable
CREATE TABLE "GlobalLock" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "timeout" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalLock_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "RepeatKey" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepeatKey_pkey" PRIMARY KEY ("key")
);
