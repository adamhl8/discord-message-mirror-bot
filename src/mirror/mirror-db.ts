import type { Guild } from "discord.js"
import type { Result } from "ts-explicit-errors"
import { attempt, err, isErr } from "ts-explicit-errors"

import { prisma } from "#db.ts"
import type { Mirror } from "#generated/prisma/client.ts"

/** The mirrors that forward messages _out of_ the given channel */
export const getMirrors = async (channelId: string, guild: Guild): Promise<Result<Mirror[]>> => {
  const mirrors = await attempt(async () =>
    prisma.mirror.findMany({
      where: {
        channelAId: channelId,
        guildId: guild.id,
      },
    }),
  )

  if (isErr(mirrors)) return err(`failed to get mirrors for channel '${channelId}'`, mirrors)

  return mirrors
}

export const getAllMirrors = async (guild: Guild): Promise<Result<Mirror[]>> => {
  const mirrors = await attempt(async () =>
    prisma.mirror.findMany({
      where: {
        guildId: guild.id,
      },
    }),
  )

  if (isErr(mirrors)) return err("failed to get mirrors", mirrors)

  return mirrors
}

export const saveMirror = async (mirror: Mirror): Promise<Result> => {
  const result = await attempt(async () =>
    prisma.mirror.upsert({
      where: {
        id: mirror.id,
        guildId: mirror.guildId,
      },
      update: mirror,
      create: mirror,
    }),
  )

  if (isErr(result)) return err(`failed to save mirror '${mirror.id}'`, result)
}

export const deleteMirror = async (id: string, guild: Guild): Promise<Result> => {
  const result = await attempt(async () =>
    prisma.mirror.delete({
      where: {
        id,
        guildId: guild.id,
      },
    }),
  )

  if (isErr(result)) return err(`failed to delete mirror '${id}'`, result)
}
