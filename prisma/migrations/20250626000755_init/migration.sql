-- CreateTable
CREATE TABLE "GuildSettings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "adminRoleId" TEXT
);

-- CreateTable
CREATE TABLE "Mirror" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "channelAId" TEXT NOT NULL,
    "channelBId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    CONSTRAINT "Mirror_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "GuildSettings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
