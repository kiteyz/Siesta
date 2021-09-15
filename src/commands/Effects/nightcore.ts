import Command from "../../structures/Command";
import { Message } from "discord.js";
import Client from "../../structures/Client";
import Emojis from "../../utils/Emojis";

module.exports = class Nightcore extends Command {
  client: Client;

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "nightcore";
    this.category = "Efeitos para Música";
    this.description = "Ligue ou desligue um efeito nightcore na música.";
    this.usage = "nightcore";
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

      if(actives.equalizer! == [0.3, 0.3] && actives.timescale!.pitch! == 1.2 && actives.timescale!.rate == 1.1 && actives.tremolo!.depth! == 0.3 && actives.tremolo!.frequency! == 14) {
        player.filters.setEqualizer([]).setTimescale({}).setTremolo({})
        message.reply(`:headphones: O efeito nightcore **foi desativado**.`)
      } else {
        player.filters.setEqualizer([0.3, 0.3])
        player.filters.setTimescale({ pitch: 1.2, rate: 1.1 })
        player.filters.setTremolo({ depth: 0.3, frequency: 14})
        message.reply(`:headphones: O efeito nightcore **foi ativado**.`)
      }

    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};
