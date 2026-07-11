import type { Guild } from "discord.js"
import type { Result } from "ts-explicit-errors"
import { attempt, err, isErr } from "ts-explicit-errors"

import { prisma } from "#db.ts"
import type { GuildSettings } from "#generated/prisma/client.ts"

export const saveSettings = async ({ id }: Guild, settings: Partial<GuildSettings>): Promise<Result<GuildSettings>> => {
  const newSettings = await attempt(async () =>
    prisma.guildSettings.upsert({
      where: {
        id,
      },
      update: settings,
      create: { ...settings, id },
    }),
  )

  if (isErr(newSettings)) return err("failed to save settings", newSettings)

  return newSettings
}

export const getSettings = async (guild: Guild): Promise<Result<GuildSettings>> => {
  const settings = await attempt(async () =>
    prisma.guildSettings.findUnique({
      where: {
        id: guild.id,
      },
    }),
  )
  if (isErr(settings)) return err("failed to get settings", settings)

  // initialize settings for the guild if they don't exist
  if (!settings) {
    const initialSettings = await saveSettings(guild, {})
    if (isErr(initialSettings)) return err("failed to initialize settings", initialSettings)
    return initialSettings
  }

  return settings
}
