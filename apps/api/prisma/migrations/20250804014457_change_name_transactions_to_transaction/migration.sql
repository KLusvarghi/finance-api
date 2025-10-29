/*
  Warnings:

  - You are about to drop the `Transctions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Transctions" DROP CONSTRAINT "Transctions_user_id_fkey";

-- DropTable
DROP TABLE "public"."Transctions";

-- CreateTable
CREATE TABLE "public"."Transction" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "date" DATE NOT NULL,
    "type" "public"."TransctionType" NOT NULL,

    CONSTRAINT "Transction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Transction" ADD CONSTRAINT "Transction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
