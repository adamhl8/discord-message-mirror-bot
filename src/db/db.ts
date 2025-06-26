import { PrismaClient } from "@prisma/client"

export const db = new PrismaClient()

/**
 * @param id The ID of the mirror
 * @param guildId The ID of the guild
 * @returns The mirror
 */
export async function getMirrors(id: string, guildId: string) {
  return await db.mirror.findMany({
    where: {
      channelAId: id,
      guildId,
    },
  })
}

/**
 * @param guildId The ID of the guild
 * @returns All of the mirrors for the guild
 */
export async function getAllMirrors(guildId: string) {
  return await db.mirror.findMany({
    where: {
      guildId,
    },
  })
}

interface SaveMirrorParams {
  id: string
  guildId: string
  channelAId: string
  channelBId: string
}

/**
 * @param details The details of the mirror to save
 * @returns The mirror
 */
export async function saveMirror(details: SaveMirrorParams) {
  const { id, guildId, channelAId, channelBId } = details

  return await db.mirror.upsert({
    where: {
      id,
      guildId,
    },
    create: {
      id,
      guildId,
      channelAId,
      channelBId,
    },
    update: {
      guildId,
      channelAId,
      channelBId,
    },
  })
}

/**
 * @param id The ID of the mirror
 * @returns The mirror
 */
export async function deleteMirror(id: string) {
  return await db.mirror.delete({
    where: {
      id,
    },
  })
}
