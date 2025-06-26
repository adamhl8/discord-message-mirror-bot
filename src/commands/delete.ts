import type { Command } from "discord-bot-shared"
import { SlashCommandBuilder } from "discord.js"

import { deleteMirror } from "@/db/db.ts"

export const deleteCommand: Command = {
  command: new SlashCommandBuilder()
    .setName("delete")
    .setDescription("Delete a mirror")
    .addStringOption((option) =>
      option
        .setName("mirror-id")
        .setDescription("The ID of the mirror you want to delete (run /list to see mirror IDs)")
        .setRequired(true),
    )
    .toJSON(),
  run: async (interaction) => {
    await interaction.deferReply()

    const mirrorId = interaction.options.getString("mirror-id", true)
    await deleteMirror(mirrorId)

    await interaction.editReply(`Deleted mirror: \`${mirrorId}\``)
  },
}
