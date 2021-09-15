import Command from "../../structures/Command";
import { Message, User, VoiceChannel } from "discord.js";
import ClientEmbed from '../../structures/ClientEmbed'
import Client from "../../structures/Client";
import Emojis from "../../utils/Emojis";

module.exports = class Loop extends Command {
  client: Client;

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "loop";
    this.category = "Comandos de Música";
    this.description = "Sabe quando você tem aquela música que você adora? Escute ela repetidas vezes colocando ela em loop.";
    this.usage = "loop";
    this.aliases = ['repeat'];

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

        const loop = (): void => {
            player.setTrackRepeat(!player.trackRepeat)

            if(player.trackRepeat) {
                message.reply(`:repeat: Música atual agora **está em loop**.`)
                return
            } else {
                message.reply(`:repeat: Música atual foi **retirada do loop**.`)
                return
            }
        }

        const requester = player.queue.current?.requester as User

        if(requester.id == message.author.id || voiceChannel.members.filter(result => !result.user.bot).size == 1) {
            loop()
        } else {
            message.reply(`${Emojis.Errado} Espera um pouco espertinho, só quem adicionou a música atual pode colocar ela em loop.`)
        }

    } catch(err) {
        message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};
