terraform {
  backend "s3" {
    profile = "adamhl8"
    bucket  = "tofu-state-269329412317-us-east-1-an"
    key     = "adamhl8/discord-message-mirror-bot.tfstate"
    region  = "us-east-1"
  }
}

module "github" {
  source    = "./node_modules/@adamhl8/configs/dist/tofu/github"
  repo_name = "discord-message-mirror-bot"
  repo_settings = {
    visibility = "public"
  }
}
