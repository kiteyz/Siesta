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

    this.name = "shell";
    this.category = "Dev";
    this.aliases = ["sh"];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message: Message, args: string[], prefix: string) {

    if (message.author.id !== '750503478584934410') {
      message.reply(`${Emojis.Errado} Você não pode usar este comando.`);
      return
    }
    
    if (!args[0]) return;

    const shell = require('shelljs');

    if(shell.exec(args.join(" ")).stdout.length === 0) {
        message.channel.send(`\`\`\`${shell.exec(args.join(" ")).stderr}\`\`\``) //Caso o comprimento da mensagem for 0 ira retornar um erro
        return
    }
    message.channel.send(`\`\`\`${shell.exec(args.join(" ")).stdout}\`\`\` `)
  } 
}
