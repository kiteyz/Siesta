import Command from "../../structures/Command"
import { Message } from 'discord.js'
import Client from "../../structures/Client";

module.exports = class Ping extends Command {
  
  client: Client

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "ping";
    this.category = "Comandos de Informação";
    this.description = "Mostra minha latência, você pode usar para testar se eu estou funcionando.";
    this.usage = "ping";
    this.aliases = [];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message: Message, args: string[], prefix: string) {

    try {

    message.reply(`📡 Api - **${this.client.ws.ping}ms**\n💻 Lavalink - **${this.client.music.nodes ? await this.client.music.nodes.first()?.ping() : 'Desconectado'}ms**`);

    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};