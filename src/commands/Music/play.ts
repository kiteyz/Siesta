import Command from "../../structures/Command"
import { Message, VoiceChannel } from 'discord.js'
import Client from "../../client"
import { Player } from 'erela.js'
import Emojis from '../../utils/Emojis'
import ClientEmbed from '../../structures/ClientEmbed'

module.exports = class Play extends Command {
  
  client: Client

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "play";
    this.category = "Comandos de Música";
    this.description = "Toque um batidão e se divirta com seus amigos.";
    this.usage = "play";
    this.aliases = ['p'];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message: Message, args: string[], prefix: string) {

    try {

      if(!message.guild?.me?.permissionsIn(message.channel.id).has('EMBED_LINKS')) {
        message.reply(`${Emojis.Errado} Preciso da permissão de **Anexar Links** para executar este comando.`)
        return
      }

      const comando = this.client.commands.get('play')

      const embed = new ClientEmbed(message.author)
        .setTitle(`Como usar? \`${prefix}${comando!.usage}\``)
        .setDescription(`${comando!.description}`)
        .addField(`:computer: Usando`, `:pencil2: **Tocar um batidão pelo nome**\n\`${prefix}play ncx song\`\n:pencil2: **Tocar um batidão pelo link**\n\`${prefix}play https://www.youtube.com/watch?v=S19UcWdOA-I\``)
        .addField(`:repeat: Apelidos`, `${comando?.aliases.map(x => `\`${prefix}${x}\``).join(', ') || `\`Não tem\``}`)

      if(!args.join(' ')) {
        message.reply({ embeds: [embed] })
        return
      }

      const playerr = this.client.music.players.get(message.guild!.id)

      if(!this.client.music.canPlay(message, playerr)) return

      const voiceChannelID = message.member!.voice.channel!.id
      const voiceChannel = this.client.channels.cache.get(voiceChannelID) as VoiceChannel
      
      const createPlayer = (): Player => {

        const player = this.client.music.create({
          guild: message.guild!.id,
          voiceChannel: voiceChannelID,
          textChannel: message.channel.id,
          selfDeafen: true
        })

        return player
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

      const player = playerr || createPlayer()

      if(player.state === 'DISCONNECTED') {
        if(message.member?.permissions.has('MANAGE_CHANNELS') && voiceChannel.userLimit && voiceChannel.members.size >= voiceChannel.userLimit) {
            message.reply(`${Emojis.Errado} Ei, o canal está cheio, está achando que eu sou boba?`)
            player.destroy()
            return
        }
        player.connect()
        message.channel.send(`:computer: Conectada em ${voiceChannel}`)
      }

      message.channel.send(`:mag_right: Pesquisando \`${args.join(' ')}\``)

      if(res.loadType === 'PLAYLIST_LOADED') {

        const playlist = res.playlist

        for (const track of res.tracks)
          player.queue.add(track)
          if(player.queue.current)

        if(!player.playing)
          player.play()

        const embed = new ClientEmbed(message.author)
        .setTitle(`Playlist Adicionada`)
        .addField(`Nome:`, `\`${playlist?.name}\``)
        .addField(`Músicas:`, `\`${res.tracks.length}\``)
        .addField(`Duração:`, `\`${this.client.utils.msToHour(res.playlist?.duration || 0)}\``)

        message.channel.send({ embeds: [embed]})
        
        } else {

        const tracks = res.tracks

        const regexSpotify = /^(?:spotify:|(?:https?:\/\/(?:open|play)\.spotify\.com\/))(?:embed)?\/?(album|track|playlist)(?::|\/)((?:[0-9a-zA-Z]){22})/


        const embed = new ClientEmbed(message.author)
        .setTitle(`Adicionado a Fila`)
        .setThumbnail(args.join(' ').match(regexSpotify) ? '' : tracks[0].displayThumbnail('maxresdefault'))
        .addField(`Nome`, '\`' + tracks[0].title + '\`')
        .addField(`Autor`, '\`' + tracks[0].author + '\`', true)
        .addField(`Duração`, '\`' + this.client.utils.msToHour(tracks[0].duration).replace('17:12:56', 'Ao vivo') + '\`', true)
        .addField(`Posição na Fila`, '\`' + (player.queue.length + 1) + '\`', true)
        .addField(`Requisitado por`, '\`' + message.author.username + '\`')


        if(player.queue.current) message.channel.send({ embeds: [embed] })

        player.queue.add(tracks[0])

        if(!player.playing)
          player.play()

      }

    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};