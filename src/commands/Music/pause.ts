import Command from "../../structures/Command";
import { Message } from "discord.js";
import Client from "../../structures/Client";
import Emojis from "../../utils/Emojis";

module.exports = class Pause extends Command {
  client: Client;

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "pause";
    this.category = "Comandos de Música";
    this.description = "As vezes você precisa sair um pouco do discord, use este comando para pausar sua música.";
    this.usage = "pause";
    this.aliases = ["stop"];

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
        message.reply(`${Emojis.Errado} Como você quer usar este comando sem entrar em um canal de voz? Vamos, entre.`)
        return
      }

      if(player.paused) {
        message.reply(`${Emojis.Errado} Espera um pouco espertinho, a música já está pausada, acha que eu sou boba?`)
        return
      }


      message.channel.send(`:pause_button: Música pausada`)
      player.pause(true)

    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};
