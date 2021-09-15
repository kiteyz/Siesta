import Command from "../../structures/Command"
import { Message, User } from 'discord.js'
import Client from "../../client";
import ClientEmbed from '../../structures/ClientEmbed'

module.exports = class UserInfo extends Command {
  
  client: Client

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "userinfo";
    this.category = "Comandos de Informação";
    this.description = "Mostra informações interessantes sobre um usuário.";
    this.usage = "userinfo";
    this.aliases = ["ui"];

    this.enabled = true;
    this.guildOnly = true;
  }

  getDevice(user: User, message: Message): string | null {
    if (!message.guild!.members.cache.get(user.id)?.presence?.clientStatus) return null;

    const res: string[] = [];
    if (message.guild!.members.cache.get(user.id)?.presence?.clientStatus?.desktop) res.push(':computer:');
    if (message.guild!.members.cache.get(user.id)?.presence?.clientStatus?.mobile) res.push(':mobile_phone:');
    if (message.guild!.members.cache.get(user.id)?.presence?.clientStatus?.web) res.push(':globe_with_meridians:');

    return res.join(' | ');
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

      const member = message.guild!.members.cache.get(USER!.id)

      const embed = new ClientEmbed(message.author)
      .setTitle(`Informações de Usuário`)
      .setThumbnail(USER!.displayAvatarURL({ dynamic: true, size: 2048 }))
      .addField(`Nome`, '`' + USER!.username + '`', true)
      .addField(`ID`, '`' + USER!.id + '`', true)
      .addField(`Criação da Conta`, `<t:${Math.floor(Number(USER!.createdAt) / 1000)}:d> (<t:${Math.floor(Number(USER!.createdAt) / 1000)}:R>)`)

      if(member) {
          embed.addField(`Entrada no Servidor`, `<t:${Math.floor(Number(member.joinedAt) / 1000)}:d> (<t:${Math.floor(Number(member.joinedAt) / 1000)}:R>)`)

          const devices = this.getDevice(USER, message)

          if(devices) {
              embed.addField(`Dispositivos`, devices)
          }
      }

      message.reply({ embeds: [embed] })

    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};