import Command from "../../structures/Command";
import { Message, User, VoiceChannel } from "discord.js";
import ClientEmbed from '../../structures/ClientEmbed'
import Client from "../../client";
import Emojis from "../../utils/Emojis";

module.exports = class Qloop extends Command {
  client: Client;

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "qloop";
    this.category = "Comandos de Música";
    this.description = "Sabe quando você tem músicas que você adora? Ouça essas músicas repetidamente colocando sua fila de reprodução em loop.";
    this.usage = "loop";
    this.aliases = ['loopqueue', 'lq', 'queueloop'];

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

        const loop = (): void => {
            player.setQueueRepeat(!player.queueRepeat)

            if(player.queueRepeat) {
                message.reply(`:repeat: A fila de reprodução agora **está em loop**.`)
                return
            } else {
                message.reply(`:repeat: A fila de reprodução foi **retirada do loop**.`)
                return
            }
        }

        loop()

    } catch(err) {
        message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};
