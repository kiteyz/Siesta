import Command from "../../structures/Command";
import { Interaction, Message, MessageSelectMenu, VoiceChannel, MessageActionRow, SelectMenuInteraction } from "discord.js";
import ClientEmbed from '../../structures/ClientEmbed'
import Client from "../../structures/Client";
import { Player } from 'erela.js'
import Emojis from '../../utils/Emojis'

module.exports = class Search extends Command {
  client: Client;

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "search";
    this.category = "Comandos de Música";
    this.description = "Sabe quando você tem aquele ser artista preferido, mas não sabe qual música dele ouvir? Use este comando para escolher entre 10 resultados da minha pesquisa.";
    this.usage = "search";
    this.aliases = ['find'];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message: Message, args: string[], prefix: string) {

    try {

        const comando = this.client.commands.get('search')

        const embed = new ClientEmbed(message.author)
          .setTitle(`Como usar? \`${prefix}${comando!.usage}\``)
          .setDescription(`${comando!.description}`)
          .addField(`:computer: Usando`, `:pencil2: **Procurar uma música**\n\`${prefix}seach ncx song\``)
          .addField(`:repeat: Apelidos`, `${comando?.aliases.map(x => `\`${prefix}${x}\``).join(', ') || `\`Não tem\``}`)
  
        if(!args.join(' ')) {
          message.reply({ embeds: [embed] })
          return
        }

        const playerr = this.client.music.players.get(message.guild!.id);

        if(!this.client.music.canPlay(message, playerr)) return

        const voiceChannelID = message.member!.voice.channel!.id
        const voiceChannel = this.client.channels.cache.get(voiceChannelID) as VoiceChannel

        const createPlayer = (): Player => {

        const player = this.client.music.create({
            guild: message.guild!.id,
            voiceChannel: voiceChannelID,
            textChannel: message.channel.id,
            selfDeafen: true,
        })

        return player
        }

        const res = await this.client.music.search(args.join(' '), message.author)

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

        switch(res.loadType) {
            case 'LOAD_FAILED':
                message.reply(`:sob: Eita eita, ocorreu um erro ao buscar a música.`)
                return
            break;
            case 'NO_MATCHES':
                message.reply(`:sob: Eita eita, não encontrei nenhuma música.`)
                return
            break;
            case 'PLAYLIST_LOADED':
                message.reply(`${Emojis.Errado} Ei espertinho, você não pode inserir links neste pesquisa.`)
                return
            break;
            case 'TRACK_LOADED':
                message.reply(`${Emojis.Errado} Ei espertinho, você não pode inserir links neste pesquisa.`)
                return
            break;
            case 'SEARCH_RESULT':
                let max = 10

                if(res.tracks.length < max) max = res.tracks.length

                let options = res.tracks.slice(0, max).map(({ title, identifier}, i) => {
                    return {
                        label: `${++i}. ${title.slice(0, 25)}`,
                        value: identifier,
                    }
                });

                var menu = new MessageSelectMenu()
                .setCustomId('musicSearch')
                .setPlaceholder('Selecione as músicas desejadas aqui')
                .setMinValues(1)
                .setMaxValues(max)
                .addOptions(options)

                const row = new MessageActionRow().addComponents([menu])

                const results = res.tracks.slice(0, max).map((track, index) =>`**${++index}.** \`${track.title.length >= 40 ? track.title.slice(0, 40) + "..." : track.title}\``).join("\n");

                const search = new ClientEmbed(message.author)
                .setTitle(`🔍 Resultados Encontrados`)
                .setDescription(results);

                const msg = await message.reply({ embeds: [search], components: [row]})

                const filtro = (interaction: Interaction) => interaction.isSelectMenu()

                const collector = msg.createMessageComponentCollector({ filter: filtro, time: 60 * 1000 })

                collector.on("end", async () => {
                    row.components[0].setDisabled(true)
                    msg.edit({ components: [row] });
                });

                collector.on("collect", async (interaction: SelectMenuInteraction) => {
                    if (interaction.member!.user.id != message.author.id) {
                        interaction.reply({ content: `${Emojis.Errado} Ei bobinho, apenas quem usou o comando pode utilizar esta interação.`, ephemeral: true });
                        return
                    }

                    switch (interaction.customId) {
                        case 'musicSearch':

                            let track: any[] = []

                            for (const id of interaction.values) {
                                track.push(res.tracks.find((a) => a.identifier === id));
                            }

                            player.queue.add(track)

                            if (!player.playing && !player.paused && player.queue.totalSize === track.length) player.play();

                            const embed = new ClientEmbed(message.author)
                            .setTitle(`Adicionado a Fila`)
                        .addField(`Duração`, '\`' + this.client.utils.msToHour(Number(track.map(x => x.duration).reduce((acc, curr) => +acc + +curr))).replace('17:12:56', 'Ao vivo') + '\`', true)
                            .addField(`Quantidade de Músicas`, '\`' + track.length + '\`', true)
                            .addField(`Requisitado por`, '\`' + message.author.username + '\`', true)
                            .addField(`Músicas`, track.map(a => `\`${a.title.length > 30 ? a.title.slice(0, 30) + '...': a.title}\``).join("\n"))

                            await interaction.reply({ embeds: [embed] })
                            row.components[0].setDisabled(true)
                            search.setDescription(`⚠️ O tempo expirou, use o comando novamente.`)
                            await msg.edit({ embeds: [search], components: [row] });
                            collector.stop();
              
                        break
                    }
                })
            break
        }


    } catch(err) {
        message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
        console.log(err)
    }
  }
};