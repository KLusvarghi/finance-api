-- CreateEnum
CREATE TYPE "public"."TransctionType" AS ENUM ('EARNING', 'EXPENSE', 'INVESTMENT');

-- CreateTable
CREATE TABLE "public"."Transctions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "date" DATE NOT NULL,
    "type" "public"."TransctionType" NOT NULL,

    CONSTRAINT "Transctions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Transctions" ADD CONSTRAINT "Transctions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
