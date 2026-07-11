import type { CommandHook } from "discord-bot-shared"
import { isErr } from "ts-explicit-errors"

import { hasPermissions } from "#utils.ts"

export const commandHook: CommandHook = async (interaction) => {
  const member = await interaction.guild.members.fetch({ user: interaction.user.id })
  const hasPermissionsResult = await hasPermissions(member)
  if (isErr(hasPermissionsResult)) throw new Error(hasPermissionsResult.messageChain)

  if (!hasPermissionsResult) return { success: false, message: "You do not have permission to run this command." }

  return { success: true }
}
