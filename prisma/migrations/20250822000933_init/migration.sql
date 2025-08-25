-- CreateEnum
CREATE TYPE "public"."Cadence" AS ENUM ('WEEKLY', 'BIWEEKLY', 'SEMIMONTHLY', 'MONTHLY');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaySchedule" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cadence" "public"."Cadence" NOT NULL,
    "anchorDate" TIMESTAMP(3) NOT NULL,
    "weekday" INTEGER,
    "semiDays" TEXT,
    "defaultNetPay" INTEGER NOT NULL,

    CONSTRAINT "PaySchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Bill" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "dueDay" INTEGER,
    "recurrence" "public"."Cadence" NOT NULL DEFAULT 'MONTHLY',
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BillOccurrence" (
    "id" TEXT NOT NULL,
    "billId" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'FORECAST',
    "assignedPayId" TEXT,

    CONSTRAINT "BillOccurrence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Paycheck" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "payDate" TIMESTAMP(3) NOT NULL,
    "netPayCents" INTEGER NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paycheck_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."PaySchedule" ADD CONSTRAINT "PaySchedule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bill" ADD CONSTRAINT "Bill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BillOccurrence" ADD CONSTRAINT "BillOccurrence_billId_fkey" FOREIGN KEY ("billId") REFERENCES "public"."Bill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Paycheck" ADD CONSTRAINT "Paycheck_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
