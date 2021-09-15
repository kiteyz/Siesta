import Command from "../../structures/Command";
import { Message } from "discord.js";
import Client from "../../client";
import ClientEmbed from "../../structures/ClientEmbed";
import Emojis from "../../utils/Emojis";

module.exports = class Eval extends Command {
  client: Client;

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "eval";
    this.category = "Dev";
    this.aliases = ["e"];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message: Message, args: string[], prefix: string) {

    if (message.author.id !== '750503478584934410') {
      message.reply(`${Emojis.Errado} Você não pode usar este comando.`);
      return
    }
    
    if (!args[0]) return;

    try {

      let code = await eval(args.join(" "));

      if (typeof code !== "string") code = await require("util").inspect(code, { depth: 0 });
      
      message.reply(`**📩 Entrada:**\`\`\`js\n${args.join(" ")}\`\`\`\n**:outbox_tray: Saída:**\`\`\`js\n${code.slice(0, 1010)}\n\`\`\``);

    } catch (err) {
      if (err) {
        message.reply(`\`\`\`js\n${err}\n\`\`\``);
      }
    }
  }
}
