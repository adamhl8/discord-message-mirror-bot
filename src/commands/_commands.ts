import type { Bot } from "discord-bot-shared"

import { deleteCommand } from "@/commands/delete.js"
import { list } from "@/commands/list.js"
import { mirror } from "@/commands/mirror.js"
import { settings } from "@/commands/settings.js"

/**
 * @param bot The bot
 */
export function addCommands(bot: Bot) {
  bot.commands.add(deleteCommand)
  bot.commands.add(list)
  bot.commands.add(mirror)
  bot.commands.add(settings)
}
