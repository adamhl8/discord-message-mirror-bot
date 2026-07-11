import type { Command } from "discord-bot-shared"
import { ChatInputCommandBuilder } from "discord.js"
import { isErr } from "ts-explicit-errors"

import { deleteMirror } from "#mirror/mirror-db.ts"

export const deleteCommand: Command = {
  command: new ChatInputCommandBuilder()
    .setName("delete")
    .setDescription("Delete a mirror")
    .addStringOptions((option) =>
      option
        .setName("mirror-id")
        .setDescription("The ID of the mirror you want to delete (run /list to see mirror IDs)")
        .setRequired(true),
    ),
  run: async (interaction) => {
    await interaction.deferReply()

    const mirrorId = interaction.options.getString("mirror-id", true)

    const deleteMirrorResult = await deleteMirror(mirrorId, interaction.guild)
    if (isErr(deleteMirrorResult)) throw new Error(deleteMirrorResult.messageChain)

    await interaction.editReply(`Deleted mirror: \`${mirrorId}\``)
  },
}
