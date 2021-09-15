import Command from "../../structures/Command";
import { Message } from "discord.js";
import Client from "../../client";
import Emojis from "../../utils/Emojis";

module.exports = class Vaporwave extends Command {
  client: Client;

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "vaporwave";
    this.category = "Efeitos para Música";
    this.description = "Ligue ou desligue um efeito vaporwave na música.";
    this.usage = "vaporwave";
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

      const actives = player.filters.active

      if(actives.equalizer! == [0.3, 0.3] && actives.timescale!.pitch! == 0.5 && actives.tremolo!.depth! == 0.3 && actives.tremolo!.frequency! == 14) {
        player.filters.setEqualizer([]).setTimescale({}).setTremolo({})
        message.reply(`:headphones: O efeito vaporwave **foi desativado**.`)
      } else {
        player.filters.setEqualizer([0.3, 0.3])
        player.filters.setTimescale({ pitch: 0.5 })
        player.filters.setTremolo({ depth: 0.3, frequency: 14})
        message.reply(`:headphones: O efeito vaporwave **foi ativado**.`)
      }

    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};
