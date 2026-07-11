import type { Command } from "discord-bot-shared"
import { ChatInputCommandBuilder } from "discord.js"
import { err, filterMap, isErr } from "ts-explicit-errors"

import { getGuildTextChannel } from "#guild-utils.ts"
import { getAllMirrors } from "#mirror/mirror-db.ts"

export const list: Command = {
  command: new ChatInputCommandBuilder().setName("list").setDescription("List all mirrors"),
  run: async (interaction) => {
    await interaction.deferReply()

    const { guild } = interaction

    const mirrors = await getAllMirrors(guild)
    if (isErr(mirrors)) throw new Error(mirrors.messageChain)

    const { values: mirrorList, errors: mirrorErrors } = await filterMap(mirrors, async (mirror) => {
      const channelA = await getGuildTextChannel(guild, mirror.channelAId)
      if (isErr(channelA)) return err(`failed to get channel with ID '${mirror.channelAId}'`, channelA)

      const channelB = await getGuildTextChannel(guild, mirror.channelBId)
      if (isErr(channelB)) return err(`failed to get channel with ID '${mirror.channelBId}'`, channelB)

      return `(${mirror.id}) ${channelA.name} -> ${channelB.name}`
    })
    if (mirrorErrors)
      throw new Error(`failed to list mirrors:\n${mirrorErrors.map((error) => error.messageChain).join("\n")}`)

    const reply = mirrorList.length === 0 ? "No mirrors have been created." : `\`\`\`\n${mirrorList.join("\n")}\n\`\`\``
    await interaction.editReply(reply)
  },
}
