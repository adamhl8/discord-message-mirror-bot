import { getChannel, type Command } from "discord-bot-shared"
import { ChannelType, SlashCommandBuilder } from "discord.js"

import { getAllMirrors } from "@/db/db.ts"

export const list: Command = {
  command: new SlashCommandBuilder().setName("list").setDescription("List all mirrors").toJSON(),
  run: async (interaction) => {
    await interaction.deferReply()

    const mirrors = await getAllMirrors(interaction.guildId)

    const mirrorListPromises = mirrors.map(async (mirror) => {
      const channelA = await getChannel(interaction.guild, mirror.channelAId, ChannelType.GuildText)
      const channelB = await getChannel(interaction.guild, mirror.channelBId, ChannelType.GuildText)
      return `(${mirror.id}) ${channelA.name} -> ${channelB.name}`
    })

    const mirrorList = await Promise.all(mirrorListPromises)

    const reply = mirrorList.length === 0 ? "No mirrors have been created." : `\`\`\`\n${mirrorList.join("\n")}\n\`\`\``
    await interaction.editReply(reply)
  },
}
