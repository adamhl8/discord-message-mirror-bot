import type { Guild, TextChannel } from "discord.js"
import { ChannelType } from "discord.js"
import type { Result } from "ts-explicit-errors"
import { attempt, err, isErr } from "ts-explicit-errors"

export const getGuildTextChannel = async (guild: Guild, channelId: string): Promise<Result<TextChannel>> => {
  const channel = await attempt(async () => guild.channels.fetch(channelId))
  if (isErr(channel)) return err("failed to fetch channel", channel)

  if (!channel) return err("channel not found", undefined)

  if (channel.type !== ChannelType.GuildText) return err(`${channel.toString()} is not a text channel`, undefined)

  return channel
}
