import Command from "../../structures/Command";
import { Message, User, VoiceChannel } from "discord.js";
import ClientEmbed from '../../structures/ClientEmbed'
import Client from "../../client";
import Emojis from "../../utils/Emojis";

module.exports = class Removedupes extends Command {
  client: Client;

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "removedupes";
    this.category = "Comandos de Música";
    this.description = "Adicionou músicas repetidas? Tire todas as músicas repetidas.";
    this.usage = "removedupes";
    this.aliases = ['rmd', 'rd', 'drm'];

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

        const remove = (): void => {

            let tracks = player.queue;
            const newtracks = [];
            for (let i = 0; i < tracks.length; i++) {
                let exists = false;
                for (let j = 0; j < newtracks.length; j++) {
                    if (tracks[i].title === newtracks[j].title) {
                        exists = true;
                        break;
                    }
                }
                if (!exists) {
                    newtracks.push(tracks[i]);
                }
            }

            player.queue.clear()

            for (const track of newtracks)
                player.queue.add(track)

            message.reply(`:file_cabinet: Removi da fila todas as **músicas repetidas**.`)
        }
        
        remove()

    } catch(err) {
        message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};
