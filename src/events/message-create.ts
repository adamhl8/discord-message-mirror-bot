import { ChannelType, Events } from "discord.js"
import type { Event } from "discord-bot-shared"
import { getChannel } from "discord-bot-shared"

import { getMirrors } from "@/db/db.ts"

export const messageCreate: Event = {
  event: Events.MessageCreate,
  async handler(client, message) {
    if (!message.guildId) return
    if (message.author.bot) return

    const guild = await client.guilds.fetch(message.guildId)
    const mirrors = await getMirrors(message.channelId, guild.id)

    const messageSendPromises = mirrors.map(async (mirror) => {
      const channel = await getChannel(guild, mirror.channelBId, ChannelType.GuildText)
      await channel.send(message.content)
    })

    await Promise.all(messageSendPromises)
  },
}
