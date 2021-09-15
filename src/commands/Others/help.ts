import Command from "../../structures/Command";
import { Message } from "discord.js";
import Client from "../../client";
import ClientEmbed from "../../structures/ClientEmbed";

module.exports = class Help extends Command {
  client: Client;

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "help";
    this.category = "Outros Comandos";
    this.description = "Veja a minha lista de comandos.";
    this.usage = "help";
    this.aliases = ["ajuda", "commands", "comandos", "cmds"];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message: Message, args: string[], prefix: string) {

    try {

      const commands = this.client.commands;

      if(!args[0]) {
        const embed = new ClientEmbed(message.author)
        .setTitle(`Menu de Ajuda`)
        .setDescription(`・Use **${prefix}ajuda <comando>** para mais informações de comandos.\n・Tenho um total de **${this.client.commands.size} comandos**.`)
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 2048 }) as string)

      const categories = commands.filter(command => command.category != 'Dev' && command.category != 'Comandos de Economia').map(cmd => cmd.category).filter((x, f, y) => y.indexOf(x) === f)

      categories.forEach(async category => {
        const cmds = commands.filter(cmd => cmd.category == category).sort((a, b) => a.name.localeCompare(b.name)).map(result => `\`${result.name}\``).join(', ')
        
        embed.addField(category, cmds)
      })

      message.reply({ embeds: [embed] })
      }
      
      else if(commands.get(args[0].toLowerCase()) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()))) {

        const name = args[0].toLowerCase()

        const command = commands.get(name) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(name))

        const embed = new ClientEmbed(message.author)
        .setTitle(`Menu de Ajuda - Comando`)
        .addField(`Nome`, `\`${command?.name}\``, true)
        .addField(`Categoria`, `\`${command?.category || '\`Não tem\`'}\``, true)
        .addField(`Descrição`, `\`${command?.description || '\`Não tem\`'}\``)
        .addField(`Apelidos`, `${command?.aliases.map(aliases => `\`${aliases}\``).join(', ') || '\`Não tem\`'}`)

        message.reply({ embeds: [embed] })
      }

    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};