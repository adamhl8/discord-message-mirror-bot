import type { Command } from "discord-bot-shared"
import { ChatInputCommandBuilder } from "discord.js"
import { isErr } from "ts-explicit-errors"

import { saveMirror } from "#mirror/mirror-db.ts"
import { getMirrorId } from "#utils.ts"

export const mirror: Command = {
  command: new ChatInputCommandBuilder()
    .setName("mirror")
    .setDescription("Create a mirror")
    .addChannelOptions((option) => option.setName("channel-a").setDescription("The first channel").setRequired(true))
    .addChannelOptions((option) => option.setName("channel-b").setDescription("The second channel").setRequired(true))
    .addBooleanOptions((option) =>
      option
        .setName("one-way")
        .setDescription("Set to true to mirror *only* channel A to channel B")
        .setRequired(false),
    ),
  run: async (interaction) => {
    await interaction.deferReply()

    const { guildId } = interaction
    const channelAId = interaction.options.getChannel("channel-a", true).id
    const channelBId = interaction.options.getChannel("channel-b", true).id
    const oneWay = interaction.options.getBoolean("one-way", false)

    const saveMirrorResult = await saveMirror({
      id: getMirrorId(channelAId, channelBId),
      guildId,
      channelAId,
      channelBId,
    })
    if (isErr(saveMirrorResult)) throw new Error(saveMirrorResult.messageChain)

    if (!oneWay) {
      const saveReverseMirrorResult = await saveMirror({
        id: getMirrorId(channelBId, channelAId),
        guildId,
        channelAId: channelBId,
        channelBId: channelAId,
      })
      if (isErr(saveReverseMirrorResult)) throw new Error(saveReverseMirrorResult.messageChain)
    }

    const reply = oneWay
      ? `Created one-way mirror: <#${channelAId}> -> <#${channelBId}>`
      : `Created mirror: <#${channelAId}> <-> <#${channelBId}>`
    await interaction.editReply(reply)
  },
}
