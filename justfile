import "node_modules/@adamhl8/configs/dist/configs/justfile.base.just"

bump-deps: _bump-deps
    bun prisma generate

db-generate:
    bun prisma generate

db-migrate:
    bun prisma migrate dev

db-studio:
    bun prisma studio
