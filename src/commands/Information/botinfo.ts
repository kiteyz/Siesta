import Command from "../../structures/Command"
import { Message } from 'discord.js'
import Client from "../../structures/Client";
import ClientEmbed from '../../structures/ClientEmbed'

module.exports = class BotInfo extends Command {
  
  client: Client

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "botinfo";
    this.category = "Comandos de Informação";
    this.description = "Mostra informações interessantes sobre mim.";
    this.usage = "botinfo";
    this.aliases = ['bi', 'info'];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message: Message, args: string[], prefix: string) {

    try {

      const owner = this.client.users.cache.get('750503478584934410')

      const embed = new ClientEmbed(message.author)
      .setThumbnail(this.client.user!.avatarURL({ size: 2048}) as string)
      .setTitle(`Minhas Informações`)
      .setDescription(`・Olá, me chamo **${this.client.user!.username}**, sou uma simples bot brasileira e fui criada com o propósito de interagir com seus membros e tocar músicas!\n・Fui criada em **[TypeScript](https://www.typescriptlang.org/)** e meu criador é o **${owner!.username}** !\nㅤ`)
      .addField(`> 📁 **» Estatísticas**`, `・Interagindo com **${this.client.users.cache.size} usuários**.\n・Cuidando de **${this.client.guilds.cache.size} servidores**.\n・Um total de **${this.client.commands.size} comandos**.\n・Usando cerca de **${(process.memoryUsage().rss / 1024 / 1024).toFixed(0)}MB** de memória ram.`)
      .addField(`> 🔗 **» Links**`, `・**[Comunidade](https://discord.gg/XGupVn2b5k)**\n・**[Me Adicione](https://discord.com/oauth2/authorize?client_id=${this.client.user!.id}&permissions=3460168&scope=bot)**`)

      message.reply({ embeds: [embed]});

    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};