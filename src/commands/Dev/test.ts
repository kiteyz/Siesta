import Command from "../../structures/Command";
import { Message } from "discord.js";
import Client from "../../client";
import Emojis from "../../utils/Emojis";
import ClientEmbed from '../../structures/ClientEmbed'

module.exports = class Test extends Command {
  client: Client;

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "test";
    this.category = "Dev";
    this.aliases = ["teste"];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message: Message, args: string[], prefix: string) {

    if (message.author.id !== '750503478584934410') {
      message.reply(`${Emojis.Errado} Você não pode usar este comando.`);
      return
    }

    try {

      const owner = await message.guild!.fetchOwner()

      console.log(owner)

    } catch (err) {
      if (err) {
        message.reply(`\`\`\`js\n${err}\n\`\`\``);
      }
    }
  }
}
