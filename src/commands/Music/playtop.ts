import Command from "../../structures/Command"
import { Message } from 'discord.js'
import Client from "../../structures/Client"
import Emojis from '../../utils/Emojis'
import ClientEmbed from '../../structures/ClientEmbed'

module.exports = class Playtop extends Command {
  
  client: Client

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "playtop";
    this.category = "Comandos de Música";
    this.description = "Adiciona uma música ao topo da fila, uma música que será tocada logo após a música atual acabar.";
    this.usage = "playtop";
    this.aliases = ['pt', 'ptop'];

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

      const comando = this.client.commands.get('playtop')

      const embed = new ClientEmbed(message.author)
        .setTitle(`Como usar? \`${prefix}${comando!.usage}\``)
        .setDescription(`${comando!.description}`)
        .addField(`:computer: Usando`, `:pencil2: **Adicionar uma música ao topo da fila**\n\`${prefix}playtop ncx song\``)
        .addField(`:repeat: Apelidos`, `${comando?.aliases.map(x => `\`${prefix}${x}\``).join(', ') || `\`Não tem\``}`)

      if(!args.join(' ')) {
        message.reply({ embeds: [embed] })
        return
      }

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

        const regexSpotify = /^(?:spotify:|(?:https?:\/\/(?:open|play)\.spotify\.com\/))(?:embed)?\/?(album|track|playlist)(?::|\/)((?:[0-9a-zA-Z]){22})/

        const embed = new ClientEmbed(message.author)
        .setTitle(`Adicionado a Fila`)
        .setThumbnail(args.join(' ').match(regexSpotify) ? '' : tracks[0].displayThumbnail('maxresdefault'))
        .addField(`Nome`, '\`' + tracks[0].title + '\`')
        .addField(`Autor`, '\`' + tracks[0].author + '\`', true)
        .addField(`Duração`, '\`' + this.client.utils.msToHour(tracks[0].duration).replace('17:12:56', 'Ao vivo') + '\`', true)
        .addField(`Posição na Fila`, '\`' + 1 + '\`', true)
        .addField(`Requisitado por`, '\`' + message.author.username + '\`')

        message.channel.send({ embeds: [embed] })
      }
    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};