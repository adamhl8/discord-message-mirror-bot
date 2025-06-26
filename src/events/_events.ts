import type { Bot } from "discord-bot-shared"

import { messageCreate } from "@/events/message-create.ts"

/**
 * @param bot The bot
 */
export function addEvents(bot: Bot) {
  bot.events.add(messageCreate)
}
