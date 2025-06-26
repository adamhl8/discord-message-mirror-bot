import type { Command } from "discord-bot-shared"
import { SlashCommandBuilder } from "discord.js"

import { saveMirror } from "@/db/db.js"
import { getMirrorId } from "@/utils.js"

export const mirror: Command = {
  command: new SlashCommandBuilder()
    .setName("mirror")
    .setDescription("Create a mirror")
    .addChannelOption((option) => option.setName("channel-a").setDescription("The first channel").setRequired(true))
    .addChannelOption((option) => option.setName("channel-b").setDescription("The second channel").setRequired(true))
    .addBooleanOption((option) =>
      option
        .setName("one-way")
        .setDescription("Set to true to mirror *only* channel A to channel B")
        .setRequired(false),
    )
    .toJSON(),
  run: async (interaction) => {
    await interaction.deferReply()

    const guildId = interaction.guildId
    const channelAId = interaction.options.getChannel("channel-a", true).id
    const channelBId = interaction.options.getChannel("channel-b", true).id
    const oneWay = interaction.options.getBoolean("one-way", false)

    await saveMirror({
      id: getMirrorId(channelAId, channelBId),
      guildId,
      channelAId,
      channelBId,
    })
    if (!oneWay) {
      await saveMirror({
        // eslint-disable-next-line sonarjs/arguments-order
        id: getMirrorId(channelBId, channelAId),
        guildId,
        channelAId: channelBId,
        channelBId: channelAId,
      })
    }

    const reply = oneWay
      ? `Created one-way mirror: <#${channelAId}> -> <#${channelBId}>`
      : `Created mirror: <#${channelAId}> <-> <#${channelBId}>`
    await interaction.editReply(reply)
  },
}
