import { Bot } from "discord-bot-shared"
import { GatewayIntentBits as Intents, type ClientOptions } from "discord.js"

import { addCommands } from "@/commands/_commands.ts"
import commandHook from "@/commands/command-hook.ts"
import { addEvents } from "@/events/_events.ts"

const applicationId = process.env["APPLICATION_ID"] ?? ""
const token = process.env["BOT_TOKEN"] ?? ""

const clientOptions: ClientOptions = {
  intents: [Intents.Guilds, Intents.GuildMembers, Intents.GuildMessages, Intents.MessageContent],
}

const bot = new Bot({ applicationId, token, clientOptions })

bot.commands.setGlobalCommandHook(commandHook)

addCommands(bot)
addEvents(bot)

await bot.commands.unregisterGuildCommands()
await bot.commands.unregisterApplicationCommands()
await bot.commands.register()
await bot.login()
