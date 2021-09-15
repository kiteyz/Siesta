import Command from "../../structures/Command";
import { Message } from "discord.js";
import Client from "../../structures/Client";
import Emojis from "../../utils/Emojis";

module.exports = class Volume extends Command {
  client: Client;

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "volume";
    this.category = "Comandos de Música";
    this.description = "Não consigo ouvir nada, ajuste o volume como preferir!";
    this.usage = "volume";
    this.aliases = ["vol"];

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
        message.reply(`${Emojis.Errado} Como você quer usar este comando sem entrar no meu canal de voz? Vamos, entre.`)
        return
      }

      const porcent = args[0]

      if(!porcent) {
          message.reply(`:headphones: O volume está em **${player.volume}%**.`)
          return
      }

      if(!Number(porcent) || (Number(porcent) < 1 || Number(porcent) > 200)) {
          message.reply(`${Emojis.Errado} Eu não conheço o volume \`${porcent}\` ainda, sinto muito`)
          return
      }

      let emoji;

      const number = Number(porcent)

      if(number == 1) emoji = '🔇'
      else if(number > 2 && number <= 100) emoji = '🔉'
      else emoji = '🔊'

      message.channel.send(`${emoji} Volume ajustado para **${number}%**.`)
      player.setVolume(Number(porcent))

    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};
