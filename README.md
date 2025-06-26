# discord-message-mirror-bot

A Discord bot that mirrors messages from one channel to another.

## Installation

`docker-compose.yaml`

```yaml
services:
  discord-message-mirror-bot:
    container_name: discord-message-mirror-bot
    image: ghcr.io/adamhl8/discord-message-mirror-bot
    restart: always
    volumes:
      - ./data/:/app/prisma/db/
    environment:
      APPLICATION_ID: <YOUR_APPLICATION_ID>
      BOT_TOKEN: <YOUR_BOT_TOKEN>
      DATABASE_URL: file:db/prod.db
```

## Commands

`/settings set [admin-role]` - Members with `admin-role` will be able to use the bot.

- The `admin-role` argument is optional. If not set, only members with `Administrator` permissions will be able to use the bot.

`/settings list` - Prints current settings.

`/mirror <channel-a> <channel-b> [one-way]` - Mirrors messages from `channel-a` to `channel-b` and vice versa.

- If `one-way` is `true`, messages will _only_ be mirrored from `channel-a` to `channel-b`.

`/list` - Prints a list of all mirrors.

`/delete <mirror-id>` - Deletes a mirror.

- Use `/list` to find the `mirror-id`.
