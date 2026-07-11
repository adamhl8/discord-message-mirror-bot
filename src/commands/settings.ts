import type { Command } from "discord-bot-shared"
import { ChatInputCommandBuilder } from "discord.js"
import { isErr } from "ts-explicit-errors"

import { listSettings, setSettings } from "#settings/settings-service.ts"

export const settings: Command = {
  command: new ChatInputCommandBuilder()
    .setName("settings")
    .setDescription("Configure message-mirror-bot")
    .addSubcommands((subcommand) => subcommand.setName("list").setDescription("List current settings"))
    .addSubcommands((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Set all message-mirror-bot settings")
        .addRoleOptions((option) =>
          option
            .setName("admin-role")
            .setDescription("Members must have this role to interact with message-mirror-bot"),
        ),
    ),
  run: async (interaction) => {
    const subcommand = interaction.options.getSubcommand()

    const result = subcommand === "set" ? await setSettings(interaction) : await listSettings(interaction)
    if (isErr(result)) throw new Error(result.messageChain)
  },
}
