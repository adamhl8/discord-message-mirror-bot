import type { Bot } from "discord-bot-shared"
import type { GuildMember } from "discord.js"
import type { Result } from "ts-explicit-errors"
import { attempt, isErr } from "ts-explicit-errors"

import { prisma } from "#db.ts"
import { getSettings } from "#settings/settings-db.ts"

/** Whether the member is an admin or has the configured admin role */
export const hasPermissions = async (member: GuildMember): Promise<Result<boolean>> => {
  const isAdmin = member.permissions.has("Administrator")
  const settings = await getSettings(member.guild)
  if (isErr(settings)) return settings

  if (!settings.adminRoleId) return isAdmin

  return member.roles.cache.has(settings.adminRoleId) || isAdmin
}

export const registerShutdown = (bot: Bot) => {
  const shutdown = async (signal: NodeJS.Signals) => {
    console.log(`received ${signal}, shutting down`)
    const result = await attempt(async () => {
      await bot.logout()
      await prisma.$disconnect()
    })

    const shutdownError = isErr(result)
    if (shutdownError) console.error(`error during shutdown: ${result.messageChain}`)
    process.exitCode = shutdownError ? 1 : 0
  }
  process.on("SIGTERM", (signal) => void shutdown(signal))
  process.on("SIGINT", (signal) => void shutdown(signal))
}

export const getMirrorId = (channelAId: string, channelBId: string): string => {
  const combined = `${channelAId}-${channelBId}`
  const hash = new Bun.CryptoHasher("sha256").update(combined).digest("hex")

  return hash.slice(0, 8).trim()
}
