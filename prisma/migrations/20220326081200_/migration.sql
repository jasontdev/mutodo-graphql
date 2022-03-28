/*
  Warnings:

  - The primary key for the `Tasklist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Tasklist` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `UsersOfTasklists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `name` to the `Tasklist` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `tasklistId` on the `UsersOfTasklists` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "UsersOfTasklists" DROP CONSTRAINT "UsersOfTasklists_tasklistId_fkey";

-- DropIndex
DROP INDEX "Tasklist_id_key";

-- AlterTable
ALTER TABLE "Tasklist" DROP CONSTRAINT "Tasklist_pkey",
ADD COLUMN     "name" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Tasklist_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "UsersOfTasklists" DROP CONSTRAINT "UsersOfTasklists_pkey",
DROP COLUMN "tasklistId",
ADD COLUMN     "tasklistId" INTEGER NOT NULL,
ADD CONSTRAINT "UsersOfTasklists_pkey" PRIMARY KEY ("userUuid", "tasklistId");

-- AddForeignKey
ALTER TABLE "UsersOfTasklists" ADD CONSTRAINT "UsersOfTasklists_tasklistId_fkey" FOREIGN KEY ("tasklistId") REFERENCES "Tasklist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
