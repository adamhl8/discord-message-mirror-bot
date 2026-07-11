import type { Bot } from "discord-bot-shared"

import { messageCreate } from "#events/message-create.ts"

export const addEvents = (bot: Bot) => {
  bot.events.add(messageCreate)
}
