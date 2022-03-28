-- CreateTable
CREATE TABLE "User" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Tasklist" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Tasklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersOfTasklists" (
    "userUuid" TEXT NOT NULL,
    "tasklistId" TEXT NOT NULL,

    CONSTRAINT "UsersOfTasklists_pkey" PRIMARY KEY ("userUuid","tasklistId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tasklist_id_key" ON "Tasklist"("id");

-- AddForeignKey
ALTER TABLE "UsersOfTasklists" ADD CONSTRAINT "UsersOfTasklists_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersOfTasklists" ADD CONSTRAINT "UsersOfTasklists_tasklistId_fkey" FOREIGN KEY ("tasklistId") REFERENCES "Tasklist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
