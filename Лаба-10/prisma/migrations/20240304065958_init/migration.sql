-- CreateTable
CREATE TABLE "Pizzas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "calories" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Turtles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "color" TEXT,
    "weaponId" INTEGER,
    "favoritePizzaId" INTEGER,
    "secondFavoritePizzaId" INTEGER,
    "image" TEXT,
    CONSTRAINT "Turtles_secondFavoritePizzaId_fkey" FOREIGN KEY ("secondFavoritePizzaId") REFERENCES "Pizzas" ("id") ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT "Turtles_favoritePizzaId_fkey" FOREIGN KEY ("favoritePizzaId") REFERENCES "Pizzas" ("id") ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT "Turtles_weaponId_fkey" FOREIGN KEY ("weaponId") REFERENCES "Weapons" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Weapons" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "dps" INTEGER
);
