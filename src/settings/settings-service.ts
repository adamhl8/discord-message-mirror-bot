import type { ChatInputCommandInteraction } from "discord.js"
import type { Result } from "ts-explicit-errors"
import { attempt, err, isErr } from "ts-explicit-errors"

import { getSettings, saveSettings } from "#settings/settings-db.ts"

export const listSettings = async (interaction: ChatInputCommandInteraction<"cached">): Promise<Result> => {
  const { guild } = interaction

  const settings = await getSettings(guild)
  if (isErr(settings)) return settings

  const adminRoleResult = await attempt(async () => {
    if (!settings.adminRoleId) return
    const role = await guild.roles.fetch(settings.adminRoleId)
    return role.toString()
  })
  if (isErr(adminRoleResult)) return err("failed to fetch admin role", adminRoleResult)
  const adminRole = adminRoleResult ?? "_Not set_"

  const replyResult = await attempt(async () =>
    interaction.reply(`## Current Settings\n\n**Admin Role:** ${adminRole}`),
  )
  if (isErr(replyResult)) return err("failed to reply with current settings", replyResult)
}

export const setSettings = async (interaction: ChatInputCommandInteraction<"cached">): Promise<Result> => {
  const adminRoleId = interaction.options.getRole("admin-role", false)?.id ?? null

  const settings = await saveSettings(interaction.guild, { adminRoleId })
  if (isErr(settings)) return settings

  return listSettings(interaction)
}
