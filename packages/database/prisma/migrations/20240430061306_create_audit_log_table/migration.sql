-- CreateTable
CREATE TABLE "AuditLog" (
    "id" SERIAL NOT NULL,
    "userEmail" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "userIp" TEXT,
    "accessLevel" TEXT NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);
