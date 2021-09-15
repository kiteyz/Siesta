import Command from "../../structures/Command";
import { Message } from "discord.js";
import Client from "../../client";
import Emojis from "../../utils/Emojis";

module.exports = class Eightd extends Command {
  client: Client;

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "8d";
    this.category = "Efeitos para Música";
    this.description = "Ligue ou desligue um efeito 8d na música.";
    this.usage = "8d";
    this.aliases = [];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message: Message, args: string[], prefix: string) {

    try {

      const player = this.client.music.players.get(message.guild!.id);

      if (!player) {
        message.reply(`${Emojis.Errado} Ei bobinho, eu não estou tocando nada neste servidor!`)
        return
      }

      const voiceChannelID = message.member?.voice.channel?.id

      if (!voiceChannelID || (voiceChannelID && voiceChannelID !== player.voiceChannel)) {
        message.reply(`${Emojis.Errado} como você quer user este comando sem entrar no meu canal de voz? Vamos, entre.`)
        return
      }

      if(player.filters.active.rotation?.speed! > 0) {
        player.filters.setRotation({ speed: 0 })
        message.reply(`:headphones: O efeito 8d **foi desativado**.`)
      } else {
        player.filters.setRotation({ speed: 0.2})
        message.reply(`:headphones: O efeito 8d **foi ativado**.`)
      }

    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};
