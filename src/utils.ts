import type { Guild, GuildMember } from "discord.js"
import { throwError } from "discord-bot-shared"

import { getSettings } from "~/settings/settings-db.ts"

/**
 * @param member The member to check
 * @returns Whether the member is a moderator
 */
export async function hasPermissions(member: GuildMember) {
  const isAdmin = member.permissions.has("Administrator")
  const settings = await getSettings(member.guild.id)
  const adminRoleId = settings?.adminRoleId

  return isAdmin || (adminRoleId && member.roles.cache.has(adminRoleId))
}

/**
 * @param guild The guild
 * @param id The ID of the member
 * @returns The member
 */
export async function fetchMemberById(guild: Guild, id: string) {
  const members = await guild.members.fetch()
  return members.get(id) ?? throwError(`Failed to get member with ID: ${id}`)
}

/**
 * @param channelAId The ID of the first channel
 * @param channelBId The ID of the second channel
 * @returns The mirror ID
 */
export function getMirrorId(channelAId: string, channelBId: string) {
  const combined = `${channelAId}-${channelBId}`
  const hasher = new Bun.CryptoHasher("sha256")
  const hash = hasher.update(combined).digest("hex")

  return hash.slice(0, 8).trim()
}
