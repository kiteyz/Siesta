import Command from "../../structures/Command";
import {
  Message,
  TextChannel,
} from "discord.js";
import Client from "../../client";
import Emojis from "../../utils/Emojis";
import ClientEmbed from '../../structures/ClientEmbed'

module.exports = class BugReport extends Command {
  client: Client;

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "bugreport";
    this.category = "Outros Comandos";
    this.description = "Sempre tem algum bugzinho chato, reporte bugs para meus desenvolvedores.";
    this.usage = "bugreport";
    this.aliases = [];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message: Message, args: string[], prefix: string) {

    try {

      const report = args.join(' ')

      const comando = this.client.commands.get('bugreport')

        const embed = new ClientEmbed(message.author)
        .setTitle(`Como usar? \`${prefix}${comando!.usage}\``)
        .setDescription(`${comando!.description}`)
        .addField(`:computer: Usando`, `:pencil2: **Reportando um bug chato**\n\`${prefix}bugreport Não consegui adicionar a música e retornou que houve um erro.\``)
        .addField(`:repeat: Apelidos`, `${comando?.aliases.map(x => `\`${prefix}${x}\``).join(', ') || `\`Não tem\``}`)

      if(!report) {
        message.reply({ embeds: [embed] })
        return
      }

      const channel = this.client.channels.cache.get('833790393765330965') as TextChannel

      message.reply(`${Emojis.Certo} Seu report foi enviado com sucesso, obrigado por reportar.\n:warning: O uso deste comando para brincadeiras pode levar a **punição**.`)
      channel.send(`:satellite: **Um novo report de bug foi recebido!**\n\nReport: ${report}\nAutor: ${message.author.username}`)

    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};