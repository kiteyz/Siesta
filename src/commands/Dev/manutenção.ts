import Command from "../../structures/Command";
import { Message } from "discord.js";
import Client from "../../structures/Client";
import ClientEmbed from "../../structures/ClientEmbed";
import Emojis from "../../utils/Emojis";

module.exports = class Manutenção extends Command {
  client: Client;

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "manutenção";
    this.category = "Dev";
    this.aliases = ["manu"];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message: Message, args: string[], prefix: string) {

    if (message.author.id !== '750503478584934410') {
      message.reply(`${Emojis.Errado} Você não pode usar este comando.`);
      return
    }
    
    if (!args[0]) return;

    const command = args[0].toLowerCase();
    const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command) as string);

    if(!cmd) {
        message.reply(`${Emojis.Errado} Este comando não existe.`)
    }

    const commandC = await this.client.commandDB.findOne({ idC: cmd?.name })

    if(commandC?.maintenance) {
        await this.client.commandDB.updateOne({ idC: cmd?.name }, {$set: { maintenance: false }})
        message.channel.send(`${Emojis.Certo} O comando foi retirado da manutenção.`)
    } else {
        await this.client.commandDB.updateOne({ idC: cmd?.name }, {$set: { maintenance: true }})
        message.channel.send(`${Emojis.Certo} O comando foi colocado em manutenção.`)
    }
  }
}
