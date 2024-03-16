/*
  Warnings:

  - You are about to drop the `Pizzas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Turtles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Weapons` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Pizzas";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Turtles";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Weapons";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Faculty" (
    "faculty" TEXT NOT NULL PRIMARY KEY,
    "faculty_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Pulpit" (
    "pulpit" TEXT NOT NULL PRIMARY KEY,
    "pulpit_name" TEXT NOT NULL,
    "faculty_id" TEXT NOT NULL,
    CONSTRAINT "Pulpit_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "Faculty" ("faculty") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Teacher" (
    "teacher" TEXT NOT NULL PRIMARY KEY,
    "teacher_name" TEXT NOT NULL,
    "pulpit_id" TEXT NOT NULL,
    CONSTRAINT "Teacher_pulpit_id_fkey" FOREIGN KEY ("pulpit_id") REFERENCES "Pulpit" ("pulpit") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Subject" (
    "subject" TEXT NOT NULL PRIMARY KEY,
    "subject_name" TEXT NOT NULL,
    "pulpit_id" TEXT NOT NULL,
    CONSTRAINT "Subject_pulpit_id_fkey" FOREIGN KEY ("pulpit_id") REFERENCES "Pulpit" ("pulpit") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Auditorium_Type" (
    "auditorium_type" TEXT NOT NULL PRIMARY KEY,
    "auditorium_typename" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Auditorium" (
    "auditorium" TEXT NOT NULL PRIMARY KEY,
    "auditorium_name" TEXT NOT NULL,
    "auditorium_capacity" INTEGER NOT NULL,
    "auditorium_type_id" TEXT NOT NULL,
    CONSTRAINT "Auditorium_auditorium_type_id_fkey" FOREIGN KEY ("auditorium_type_id") REFERENCES "Auditorium_Type" ("auditorium_type") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_faculty_key" ON "Faculty"("faculty");

-- CreateIndex
CREATE UNIQUE INDEX "Pulpit_pulpit_key" ON "Pulpit"("pulpit");

-- CreateIndex
CREATE UNIQUE INDEX "Teacher_teacher_key" ON "Teacher"("teacher");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_subject_key" ON "Subject"("subject");

-- CreateIndex
CREATE UNIQUE INDEX "Auditorium_Type_auditorium_type_key" ON "Auditorium_Type"("auditorium_type");

-- CreateIndex
CREATE UNIQUE INDEX "Auditorium_auditorium_key" ON "Auditorium"("auditorium");
