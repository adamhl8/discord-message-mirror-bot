import type { Command } from "discord-bot-shared"
import { SlashCommandBuilder } from "discord.js"

import { listSettings, setSettings } from "@/settings/settings-service.ts"

export const settings: Command = {
  command: new SlashCommandBuilder()
    .setName("settings")
    .setDescription("Configure message-mirror-bot")
    .addSubcommand((subcommand) => subcommand.setName("list").setDescription("List current settings"))
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Set all message-mirror-bot settings")
        .addRoleOption((option) =>
          option
            .setName("admin-role")
            .setDescription("Members must have this role to interact with message-mirror-bot"),
        ),
    )
    .toJSON(),
  async run(interaction) {
    const subcommand = interaction.options.getSubcommand()
    if (subcommand === "list") await listSettings(interaction)
    if (subcommand === "set") await setSettings(interaction)
  },
}
