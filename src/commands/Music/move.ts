import Command from "../../structures/Command";
import { Message, User, VoiceChannel } from "discord.js";
import ClientEmbed from '../../structures/ClientEmbed'
import Client from "../../structures/Client";
import Emojis from "../../utils/Emojis";

module.exports = class Move extends Command {
  client: Client;

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "move";
    this.category = "Comandos de Música";
    this.description = "Adicionou uma música em uma posição errada, ou simplesmente não quer que ela esteja na posição em que ela está? Mova músicas para outras posições. (A fila precisa ter mais de 3 músicas)";
    this.usage = "move";
    this.aliases = ['m', 'mv'];

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

        const move = (oldPosition: string, newPosition: string): void => {

            if(!oldPosition || !newPosition || isNaN(Number(oldPosition || newPosition)) || Number(oldPosition) <= 1 || Number(newPosition) < 1 || Number(newPosition || oldPosition) > player.queue.length) {
                const comando = this.client.commands.get('move')

                const embed = new ClientEmbed(message.author)
                .setTitle(`Como usar? \`${prefix}${comando!.usage}\``)
                .setDescription(`${comando!.description}`)
                .addField(`:computer: Usando`, `:pencil2: **Mover a música da posição 2 para a posição 5**\n\`${prefix}move 2 5\``)
                .addField(`:repeat: Apelidos`, `${comando?.aliases.map(x => `\`${prefix}${x}\``).join(', ') || `\`Não tem\``}`)

                message.reply({ embeds: [embed] })
                return
            }

            const song = player.queue[Number(oldPosition) - 1]

            const array = this.client.utils.moveArray(player.queue, Number(oldPosition) - 1, Number(newPosition) - 1)

            player.queue.clear()

            for (const track of array!)
                player.queue.add(track)

            message.reply(`:cloud: A música **${song.title.length < 20 ? song.title.slice(0, 20) + '...' : song.title}** foi movida para a posição **${args[1]}**.`)
            
        }

        move(args[0], args[1])

    } catch(err) {
        message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};
