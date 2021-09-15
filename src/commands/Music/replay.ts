import Command from "../../structures/Command";
import { Message, User, VoiceChannel } from "discord.js"
import Client from "../../client";
import Emojis from "../../utils/Emojis";

module.exports = class Replay extends Command {
  client: Client;

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "replay";
    this.category = "Comandos de Música";
    this.description = "Reinicia o precesso da música no começo, volta ao segundo 0.";
    this.usage = "replay";
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
            message.reply(`${Emojis.Errado} Como você quer usar este comando sem entrar no meu canal de voz? Vamos, entre.`)
            return
        }

        const voiceChannel = this.client.channels.cache.get(voiceChannelID) as VoiceChannel

        const seek = (): void => {
            if(!player.queue.current?.duration) {
                message.reply(`:sob: Essa não, algo deu errado, não consegui ver o tempo da música.`)
                return
            }

            player.seek(1)
            message.channel.send(`:track_previous: Música reiniciada do começo.`)
        }

        const requester = player.queue.current?.requester as User

        if(requester.id == message.author.id || voiceChannel.members.filter(result => !result.user.bot).size == 1) {
            seek()
        } else {
            message.reply(`${Emojis.Errado} Espera um pouco espertinho, só quem adicionou a música atual pode pular alterar o momento dela.`)
        }

    } catch(err) {
        message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};
