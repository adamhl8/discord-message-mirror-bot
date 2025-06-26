FROM oven/bun:latest AS base
LABEL org.opencontainers.image.source=https://github.com/adamlh8/discord-message-mirror-bot
WORKDIR /app
ENV NODE_ENV="production"
ENV BUN_OPTIONS="--bun"

FROM base AS install

RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS build

COPY --from=install /temp/dev/node_modules ./node_modules
COPY prisma ./prisma
COPY src ./src
COPY package.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./

RUN bun db:generate
RUN bun run build

FROM base

COPY --from=install /temp/prod/node_modules ./node_modules
COPY --from=build /app/dist ./dist
# copy prisma into the final image so we can run our db:migrate script
COPY prisma ./prisma
COPY package.json ./

RUN apt update && apt install openssl -y

CMD ["bun", "start:prod"]
