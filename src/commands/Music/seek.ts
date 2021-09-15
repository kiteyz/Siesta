import Command from "../../structures/Command";
import { Message, User, VoiceChannel } from "discord.js";
import ClientEmbed from '../../structures/ClientEmbed'
import Client from "../../structures/Client";
import Emojis from "../../utils/Emojis";

module.exports = class Skip extends Command {
  client: Client;

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "seek";
    this.category = "Comandos de Música";
    this.description = "Nem todo momento da música é bom, né? Selecione o momento da música que você quiser.";
    this.usage = "seek";
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

        const comando = this.client.commands.get('seek')

        const embed = new ClientEmbed(message.author)
        .setTitle(`Como usar? \`${prefix}${comando!.usage}\``)
        .setDescription(`${comando!.description}`)
        .addField(`:computer: Usando`, `:pencil2: **Pular o momento para 3:00**\n\`${prefix}seek 3:00\`\n:pencil2: **Pular o momento para 30 segundos**\n\`${prefix}seek 30\``)
        .addField(`:repeat: Apelidos`, `${comando?.aliases.map(x => `\`${prefix}${x}\``).join(', ') || `\`Não tem\``}`)

        if(!args[0]) {
            message.reply({ embeds: [embed] })
            return
        }

        const voiceChannel = this.client.channels.cache.get(voiceChannelID) as VoiceChannel

        const seek = (time: string): void => {
            if (Number(time) != 0 && !Number(time.replace(/:/g, ''))) {
                message.reply(`${Emojis.Errado} Eu não conheço o tempo \`${time}\` ainda, sinto muito.`)
                return
            }

            if(!player.queue.current?.duration) {
                message.reply(`:sob: Essa não, algo deu errado, não consegui ver o tempo da música.`)
                return
            }

            let fTime = 0

            if(time.includes(':')) {
                const parts = time.split(':')

                if(parts.length > 3) {
                    message.reply(`${Emojis.Errado} Ei, olhando aqui, o tempo precisa variar de **0 á ${player.queue.current.duration / 1000} segundos**.`)
                    return
                }

                const len = parts.length
                for(let i = 0; i < len; i++) {
                    fTime += Number(parts.pop()) * Math.pow(60, i)
                }
            }

            if((fTime && (fTime < 0 || fTime * 1000 > player.queue.current.duration)) || Number(time) < 0 || Number(time) > player.queue.current.duration / 1000) {
                message.reply(`${Emojis.Errado} Ei, olhando aqui, o tempo precisa variar de **0 á ${player.queue.current.duration / 1000} segundos**.`)
                return
            }

            player.seek(fTime && (fTime * 1000) || Number(time) * 1000)
            message.channel.send(`:track_next: Momento da música setado para **${args[0]}**.`)
        }

        const requester = player.queue.current?.requester as User

        if(requester.id == message.author.id || voiceChannel.members.filter(result => !result.user.bot).size == 1) {
            seek(args[0])
        } else {
            message.reply(`${Emojis.Errado} Espera um pouco espertinho, só quem adicionou a música atual pode pular alterar o momento dela.`)
        }

    } catch(err) {
        message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};
