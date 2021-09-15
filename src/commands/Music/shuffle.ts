import Command from "../../structures/Command";
import { Message, User, VoiceChannel } from "discord.js";
import ClientEmbed from '../../structures/ClientEmbed'
import Client from "../../client";
import Emojis from "../../utils/Emojis";

module.exports = class Shuffle extends Command {
  client: Client;

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "shuffle";
    this.category = "Comandos de Música";
    this.description = "As vezes cansa ouvir as mesmas músicas na mesma ordem, né? Emparalhe a fila de músicas para mudar um pouco essa situação.";
    this.usage = "shuffle";
    this.aliases = ['radom'];

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

        const shuffle = (): void => {
            if (!player.queue.length) {
                message.reply(`:sob: Essa não, a fila não tem nada.`);
                return;
            }

            player.queue.shuffle()

            message.reply(`:woman_juggling: Eba, A fila foi emparalhada.`)
        }

        shuffle()

    } catch(err) {
        message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};
