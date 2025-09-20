import type { Bot } from "discord-bot-shared"

import { deleteCommand } from "~/commands/delete.ts"
import { list } from "~/commands/list.ts"
import { mirror } from "~/commands/mirror.ts"
import { settings } from "~/commands/settings.ts"

/**
 * @param bot The bot
 */
export function addCommands(bot: Bot) {
  bot.commands.add(deleteCommand)
  bot.commands.add(list)
  bot.commands.add(mirror)
  bot.commands.add(settings)
}
