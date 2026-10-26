import { knipConfig } from "@adamhl8/configs"

const config = knipConfig({
  // Ignore issues in the generated Prisma client instead of excluding it, so knip still follows its `@prisma/client` imports.
  ignore: ["src/generated/**"],
})

export default config
