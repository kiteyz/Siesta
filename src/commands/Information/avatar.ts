import Command from "../../structures/Command"
import { Message, User } from 'discord.js'
import Client from "../../structures/Client";
import ClientEmbed from '../../structures/ClientEmbed'

module.exports = class Avatar extends Command {
  
  client: Client

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "avatar";
    this.category = "Comandos de Informação";
    this.description = "Mostra o avatar de um usuário.";
    this.usage = "avatar";
    this.aliases = ["av"];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message: Message, args: string[], prefix: string) {

    try {

      let USER: User | null;

      if(!args.length) {
          USER = message.author
      } else {
          USER = await this.client.utils.findUser(args.join(' '), message.guild)
      }

      if(!USER) {
        message.reply(`:sob: Procurei em toda parte, mas não encontrei um usuário que se chame **${args.join(' ')}**. Não se esqueça que eu procuro por nomes, IDs ou menções.`)
        return
      }

      const embed = new ClientEmbed(message.author)
      .setAuthor(USER.username)
      .setDescription(`:night_with_stars: Clique **[aqui](${USER.avatarURL({ dynamic: true, size: 2048})})** para baixar a imagem.`)
      .setImage(USER.displayAvatarURL({ dynamic: true, size: 2048 }))

      message.reply({ embeds: [embed] })

    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};