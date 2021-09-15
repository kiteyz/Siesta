import Command from "../../structures/Command"
import { Message, User, VoiceChannel } from 'discord.js'
import Client from "../../structures/Client"
import Emojis from '../../utils/Emojis'
import ClientEmbed from '../../structures/ClientEmbed'

module.exports = class Playskip extends Command {
  
  client: Client

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "playskip";
    this.category = "Comandos de Música";
    this.description = "Pula a música tocando no momento e toca a música escolhida.";
    this.usage = "playskip";
    this.aliases = ['ps', 'pskip', 'playnow', 'pn', 'autoplay'];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message: Message, args: string[], prefix: string) {

    try {

      const player = this.client.music.players.get(message.guild!.id)

      if (!player) {
        message.reply(`${Emojis.Errado} Ei bobinho, eu não estou tocando nada neste servidor!`)
        return
      }

      const voiceChannelID = message.member?.voice.channel?.id

      if (!voiceChannelID || (voiceChannelID && voiceChannelID !== player.voiceChannel)) {
        message.reply(`${Emojis.Errado} Como você quer usar este comando sem entrar no meu canal de voz? Vamos, entre.`)
        return
      }

      if(player.queue.duration > 8.64e7) {
        message.reply(`${Emojis.Errado} Sinto muito, a fila tem duração superior a **24 horas**, você não pode adicionar mais músicas.`)
        return
      }

      const comando = this.client.commands.get('playskip')

      const embed = new ClientEmbed(message.author)
        .setTitle(`Como usar? \`${prefix}${comando!.usage}\``)
        .setDescription(`${comando!.description}`)
        .addField(`:computer: Usando`, `:pencil2: **Tocar uma música pulando a atual pelo nome**\n\`${prefix}playskip ncx song\`\n:pencil2: **Tocar uma música pulando a atual pelo link**\n\`${prefix}playskip https://www.youtube.com/watch?v=S19UcWdOA-I\``)
        .addField(`:repeat: Apelidos`, `${comando?.aliases.map(x => `\`${prefix}${x}\``).join(', ') || `\`Não tem\``}`)

      if(!args.join(' ')) {
        message.reply({ embeds: [embed] })
        return
      }

      const voiceChannel = this.client.channels.cache.get(voiceChannelID) as VoiceChannel

      const requester = player.queue.current?.requester as User

      if(requester.id == message.author.id || voiceChannel.members.filter(result => !result.user.bot).size == 1) {

          const res = await this.client.music.search(args.join(' '), message.author)

          switch(res.loadType) {
            case 'LOAD_FAILED':
              message.reply(`:sob: Eita eita, ocorreu um erro ao buscar a música.`)
              return
            break;
            case 'NO_MATCHES':
              message.reply(`:sob: Eita eita, não encontrei nenhuma música.`)
              return
            break;
          }

          message.channel.send(`:mag_right: Pesquisando \`${args.join(' ')}\``)

          if(res.loadType === 'PLAYLIST_LOADED') {
            const playlist = res.playlist
            res.tracks.reverse()

            for (const track of res.tracks) 
              player.queue.unshift(track)

            player.stop()

            const embed = new ClientEmbed(message.author)
            .setTitle(`Playlist Adicionada`)
            .addField(`Nome:`, `\`${playlist?.name}\``)
            .addField(`Músicas:`, `\`${res.tracks.length}\``)
            .addField(`Duração:`, `\`${this.client.utils.msToHour(res.playlist?.duration || 0)}\``)

            message.channel.send({ embeds: [embed]})
          } else {
            const tracks = res.tracks

            player.queue.unshift(tracks[0])
            player.stop()

            message.channel.send(`:headphones: Música Adicionada - **${tracks[0].title.length > 25 ? tracks[0].title.slice(0, 25) + '...' : tracks[0].title}**`)
            message.channel.send(`:fast_forward: Música atual pulada`)
          }
        } else {
          message.reply(`${Emojis.Errado} Espera um pouco espertinho, só quem adicionou a música atual pode pular alterar o momento dela.`)
      }
    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};