import Command from "../../structures/Command"
import { Message } from 'discord.js'
import Client from "../../client";
import ClientEmbed from '../../structures/ClientEmbed'

module.exports = class Invite extends Command {
  
  client: Client

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "invite";
    this.category = "Comandos de Informação";
    this.description = "Mostra o link de convite para me adicionar em seu servidor!";
    this.usage = "invite";
    this.aliases = ['convite', 'links'];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message: Message, args: string[], prefix: string) {

    try {

      const embed = new ClientEmbed(message.author)
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 2048}))
      .setTitle(`👋 Olá ${message.author.username}`)
      .setDescription(`💞 **|** Você pode me adicionar [aqui](https://discord.com/oauth2/authorize?client_id=${this.client.user!.id}&permissions=3460168&scope=bot)\n\n🥂 **|** Se você precisa de ajuda ou quer interagir com pessoas incríveis, entre na minha comunidade [aqui](https://discord.gg/XGupVn2b5k)`)

      message.reply({ embeds: [embed]});

    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};