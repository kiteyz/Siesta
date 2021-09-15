import Command from "../../structures/Command"
import { Message, User } from 'discord.js'
import Client from "../../structures/Client";
import ClientEmbed from '../../structures/ClientEmbed'

module.exports = class ServerInfo extends Command {
  
  client: Client

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "serverinfo";
    this.category = "Comandos de Informação";
    this.description = "Mostra informações interessantes sobre o servidor.";
    this.usage = "serverinfo";
    this.aliases = ["si"];

    this.enabled = true;
    this.guildOnly = true;
  }

  getDevice(user: User, message: Message): string | null {
    if (!message.guild!.members.cache.get(user.id)?.presence?.clientStatus) return null;

    const res: string[] = [];
    if (message.guild!.members.cache.get(user.id)?.presence?.clientStatus?.desktop) res.push(':computer:');
    if (message.guild!.members.cache.get(user.id)?.presence?.clientStatus?.mobile) res.push(':mobile_phone:');
    if (message.guild!.members.cache.get(user.id)?.presence?.clientStatus?.web) res.push(':globe_with_meridians:');

    return res.join(' - ');
  }


  async run(message: Message, args: string[], prefix: string) {

    try {

      const server = message.guild

      const verifications: any = {
          NONE: 'Nenhuma',
          LOW: 'Baixa',
          MEDIUM: 'Médio',
          HIGH: 'Alta',
          HIGHEST: 'Muito Alta'
      }

      const embed = new ClientEmbed(message.author)
      .setTitle(`Informações do Servidor`)
      .setThumbnail(server!.iconURL({ dynamic: true, size: 2048 }) as string)
      .addField(`Nome`, '\`' + server!.name + '\`', true)
      .addField(`ID`, '\`' + server!.id + '\`', true)
      .addField(`Nível de Verificação`, `\`${[server!.verificationLevel].map(level => verifications[level])}\``, true)
      .addField(`Membros`, '\`' + server!.memberCount + '\`', true)
      .addField(`Impulsos`, '\`' + (server!.premiumSubscriptionCount == 0 ? 'Não tem' : server!.premiumSubscriptionCount) + '\`', true)
      .addField(`Emojis`, '\`' + server!.emojis.cache.size + '\`', true)
      .addField(`Criação do Servidor`, `<t:${~~(Number(server!.createdAt) / 1000)}:d> (<t:${~~(Number(server!.createdAt) / 1000)}:R>)`)
      .addField(`Entrei no Servidor`, `<t:${~~(Number(server!.joinedAt) / 1000)}:d> (<t:${~~(Number(server!.joinedAt) / 1000)}:R>)`)

      message.reply({ embeds: [embed] })

    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};