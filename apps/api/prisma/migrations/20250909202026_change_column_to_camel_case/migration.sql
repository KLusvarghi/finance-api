/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `User` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Transaction" DROP COLUMN "deleted_at",
ADD COLUMN     "deletedAt" TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "first_name",
DROP COLUMN "last_name",
ADD COLUMN     "firstName" VARCHAR(50) NOT NULL,
ADD COLUMN     "lastName" VARCHAR(50) NOT NULL;
