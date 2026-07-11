import type { Event } from "discord-bot-shared"
import { Events } from "discord.js"
import { attempt, err, filterMap, isErr } from "ts-explicit-errors"

import { getGuildTextChannel } from "#guild-utils.ts"
import { getMirrors } from "#mirror/mirror-db.ts"

export const messageCreate: Event = {
  event: Events.MessageCreate,
  handler: async (client, message) => {
    const { guildId } = message
    if (!guildId) return
    if (message.author.bot) return

    const guild = await attempt(async () => client.guilds.fetch(guildId))
    if (isErr(guild)) throw new Error(err(`failed to fetch guild '${guildId}'`, guild).messageChain)

    const mirrors = await getMirrors(message.channelId, guild)
    if (isErr(mirrors)) throw new Error(mirrors.messageChain)

    const { errors: mirrorErrors } = await filterMap(mirrors, async (mirror) => {
      const channel = await getGuildTextChannel(guild, mirror.channelBId)
      if (isErr(channel)) return err(`failed to get channel with ID '${mirror.channelBId}'`, channel)

      const sentMessage = await attempt(async () => channel.send(message.content))
      if (isErr(sentMessage)) return err(`failed to mirror message to ${channel.toString()}`, sentMessage)

      return sentMessage
    })
    if (mirrorErrors)
      throw new Error(`failed to mirror message:\n${mirrorErrors.map((error) => error.messageChain).join("\n")}`)
  },
}
