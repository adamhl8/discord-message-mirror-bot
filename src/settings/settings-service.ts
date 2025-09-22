import type { GuildSettings } from "@prisma/client"
import type { ChatInputCommandInteraction } from "discord.js"

import { getSettingsOrThrow, saveSettings } from "~/settings/settings-db.ts"

/**
 * @param interaction The interaction that triggered the command
 */
export async function listSettings(interaction: ChatInputCommandInteraction<"cached">) {
  const guild = interaction.guild
  const settings = await getSettingsOrThrow(guild.id)

  const adminRole = settings.adminRoleId ? await guild.roles.fetch(settings.adminRoleId) : undefined

  const currentSettings = `Current Settings:\n\`\`\`\nAdmin Role: ${adminRole?.name ?? "Not set"}\n\`\`\``

  await interaction.reply(currentSettings)
}

/**
 * @param interaction The interaction that triggered the command
 */
export async function setSettings(interaction: ChatInputCommandInteraction<"cached">) {
  const adminRoleId = interaction.options.getRole("admin-role", false)?.id

  const settings: GuildSettings = {
    id: interaction.guild.id,
    // eslint-disable-next-line unicorn/no-null
    adminRoleId: adminRoleId ?? null,
  }

  await saveSettings(settings)
  await listSettings(interaction)
}
