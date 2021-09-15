import Command from "../../structures/Command";
import { Message } from "discord.js";
import Client from "../../structures/Client";
import Emojis from "../../utils/Emojis";

module.exports = class Disconnect extends Command {
  client: Client;

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "disconnect";
    this.category = "Comandos de Música";
    this.description = "Me desconecta do canal de voz, use este comando quando estiver cansado de ouvir música.";
    this.usage = "disconnect";
    this.aliases = ["dc", "leave", "dis"];

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

      message.channel.send(`:dash: Desconectei do canal voz.`)
      player.destroy()

    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};
