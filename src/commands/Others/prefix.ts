import Command from "../../structures/Command"
import { Message } from 'discord.js'
import Client from "../../structures/Client";
import ClientEmbed from '../../structures/ClientEmbed'
import Emojis from '../../utils/Emojis'

module.exports = class Prefix extends Command {
  
  client: Client

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "prefix";
    this.category = "Outros Comandos";
    this.description = "Já tem algum outro amigo robô com o mesmo prefixo? Mude meu prefixo para o que você quiser!";
    this.usage = "prefix";
    this.aliases = ["setprefix"];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message: Message, args: string[], prefix: string) {

    try {
    
      if(!message.member?.permissions.has('MANAGE_GUILD')) {
          message.reply(`${Emojis.Errado} Você precisa da permissão de **Gerenciar Servidor** para usar este comando.`)
          return
      }

      const cprefix = args[0]

      const comando = this.client.commands.get('prefix')

        const embed = new ClientEmbed(message.author)
        .setTitle(`Como usar? \`${prefix}${comando!.usage}\``)
        .setDescription(`${comando!.description}`)
        .addField(`:computer: Usando`, `:pencil2: **Mudando o prefixo para !**\n\`${prefix}prefix !\``)
        .addField(`:repeat: Apelidos`, `${comando?.aliases.map(x => `\`${prefix}${x}\``).join(', ') || `\`Não tem\``}`)

      if(!cprefix) {
        message.reply({ embeds: [embed] })
        return
      }

      if(cprefix.length > 3) {
        message.reply(`${Emojis.Errado} Ei, o prefixo não pode ser tão grande assim, use no máximo **3 caracteres**.`)
        return
      }

      await this.client.guildDB.updateOne({ idS: message.guild!.id}, {$set: {prefix: cprefix.trim() }})

      message.channel.send(`💻 Prefixo no servidor alterado para **${cprefix.trim()}**`)

    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};