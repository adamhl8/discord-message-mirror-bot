import type { ChatInputCommandInteraction } from "discord.js"
import { throwUserError } from "discord-bot-shared"

import { getSettings } from "~/settings/settings-db.ts"
import { fetchMemberById, hasPermissions } from "~/utils.ts"

/**
 * @param interaction The interaction that triggered the command
 * @returns Whether the command should continue
 */
export async function commandHook(interaction: ChatInputCommandInteraction<"cached">) {
  const member = await fetchMemberById(interaction.guild, interaction.user.id)
  if (!(await hasPermissions(member))) throwUserError("You do not have permission to run this command.")

  const commandName = interaction.commandName
  const subcommandName = interaction.options.getSubcommand(false)
  const isSettingsSetCommand = commandName === "settings" && subcommandName === "set"
  const isSettingsInitialized = await getSettings(interaction.guild.id)
  if (!(isSettingsSetCommand || isSettingsInitialized))
    throwUserError("message-mirror-bot has not been configured. Please run the '/settings set' command.")

  return true
}
