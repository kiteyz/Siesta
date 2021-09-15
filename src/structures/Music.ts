import { Manager, NodeOptions, Node, Player } from "erela.js";
import { TextChannel, Message } from "discord.js";
import { Timeouts } from '../typings/index'
import Client from "../client";
import Spotify from 'better-erela.js-spotify'
import Emojis from '../utils/Emojis'

export default class ShiotaManager extends Manager {
  client: Client;
  channelTimeouts: Map<string, Timeouts>;


  constructor(client: Client, nodes: NodeOptions[]) {
    super({
      nodes,
      autoPlay: true,
      send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
      plugins: [
        new Spotify()
      ],
    });

    this.client = client;
    this.channelTimeouts = new Map();

    this.on("nodeConnect", async (node): Promise<void> => {
      console.log(this.client.color.blue(`[Lavalink] - Iniciado com sucesso. (${node.options.identifier})`));
    });

    this.on('nodeReconnect', (node): void => {
      console.log(this.client.color.red(`[Lavalink] - Reconectando a ${node.options.identifier}...`));
    });

    this.on('nodeError', (node, error): void => {
      console.log(this.client.color.red(`Ocorreu um erro no Node ${node.options.identifier}. Erro: ${error.message}`));
      if (error.message.startsWith('Unable to connect after')) this.reconnect();
    });

    this.on('nodeDisconnect', (node, reason): void => {
      console.log(this.client.color.red(`[Lavalink] - ${node.options.identifier} desconectou inesperadamente.\nMotivo: ${reason.reason ? reason.reason : reason.code ? reason.code : 'Desconhecido'}`));
    });

    this.on("trackStart", async (player, track) => {

      if(!player.textChannel) return;

      const channel = client.channels.cache.get(player.textChannel) as TextChannel

      if (player.lastPlayingMsgID) {
        const msg = channel.messages.cache.get(player.lastPlayingMsgID);
    
        if (msg) msg.delete();
      }
    
      player.lastPlayingMsgID = await channel.send(`🎶 Tocando **${track.title.slice(0, 55) + '...'}**`).then(msg => msg.id)
    });

    this.on('trackStuck', (player, track): void => {
      if (player.textChannel) {

        const channel = client.channels.cache.get(player.textChannel) as TextChannel

        channel.send(`:warning: Ocorreu um erro ao tocar **${track.title}**.`);

        player.stop();
      }
      console.error(this.client.color.red(`[Lavalink] Track Stuck on guild ${player.guild}. Music title: ${track.title}`));
    });

    this.on('trackError', async (player, track, payload): Promise<void> => {

      const channel = client.channels.cache.get(player.textChannel as string) as TextChannel

      if (payload.error && payload.error.includes('429')) {
        if (player.textChannel) {
          const appName = process.env.LAVALINKHOST?.split('.')[0];

          if (appName && !Number(appName)) {
            const status = await fetch(`https://api.heroku.com/apps/${appName}/dynos`, {
              method: 'DELETE',
              headers: {
                'Accept': 'application/vnd.heroku+json; version=3',
                'Authorization': `Bearer ${process.env.HEROKUAPITOKEN}`
              }
            }).then(r => r.status);
  
            if (status === 202) {
              channel.send(':warning: Parece que o YouTube me impediu de tocar essa música!\nAguarda um momento enquanto resolvo esse problema e tenta novamente daqui a uns segundos.');
            } else {
              channel.send(`${Emojis.Errado} Parece que o YouTube me impediu de tocar essa música!\nDesta vez não consegui resolver o problema :cry:.`);
            }
            player.destroy();
            return;
          }
        }
      }
      player.textChannel && channel.send(`${Emojis.Errado} Ocorreu um erro ao tocar a música ${track.title}. Erro: \`${payload.error || 'Desconhecido'}\``);

      console.error(this.client.color.red(`[Lavalink] Track Error on guild ${player.guild}. Error: ${payload.error}`));
      
      player.stop();
    });

    this.on('queueEnd', async (player) => {
      if (player.textChannel) {
        const channel = client.channels.cache.get(player.textChannel) as TextChannel;

        player.destroy();

        channel.send(`:wave: A lista de músicas acabou!`);
      }
    });
  }

  createBarra (player: Player, value: number, maxValue: number, size: number)  {
    const percentage = value / maxValue;
    const progress = Math.round(size * percentage);
    const emptyProgress = size - progress;
  
    const progressText = "⬜".repeat(progress);
    const emptyProgressText = "🟦" + "⬛".repeat(emptyProgress - 1);
  
    const Bar = progressText + emptyProgressText;
    return `${Bar}\n${this.client.utils.msToHour(player.position) + " / " + (player.queue.current!.duration==0?" ◉ LIVE":this.client.utils.msToHour(player.queue.current!.duration!))}`;
  };

  canPlay(message: Message, player?: Player | undefined): boolean {
    const voiceChannelID = message.member?.voice.channel?.id;

    if (!voiceChannelID) {
      message.reply(`${Emojis.Errado} Você precisa se conectar a um canal de voz para usar este comando.`);
      return false;
    }

    const permissions = message.guild?.me?.permissionsIn(voiceChannelID);

    if (!permissions!.has('VIEW_CHANNEL')) {
      message.reply(`${Emojis.Errado} Não tenho permissão para ver o seu canal de voz.`);
      return false;
    }

    if (!permissions!.has('CONNECT')) {
      message.reply(`${Emojis.Errado} Não tenho permissão para entrar no seu canal de voz.`);
      return false;
    }

    if (!permissions!.has('SPEAK')) {
      message.reply(`${Emojis.Errado} Não tenho permissão para falar no seu canal de voz.`);
      return false;
    }

    if (player && voiceChannelID !== player.voiceChannel) {
      message.reply(`${Emojis.Errado} Você precisa entrar no meu canal de voz para usar este comando.`);
      return false;
    }

    if (player&& player.queue.duration > 8.64e7) {
      message.reply(`${Emojis.Errado} Sinto muito, a fila tem duração superior a **24 horas**, você não pode adicionar mais músicas.`)
      return false;
    }
    return true;
  }

  reconnect() {
    this.destroyNode('Node 1');

    this.nodes.set('Node 1',
      new Node({
        identifier: 'Node 1',
        host: process.env.LAVALINKHOST as string,
        port: Number(process.env.LAVALINKPORT),
        password: process.env.LAVALINKPASSWORD as string,
        retryAmount: 10,
        retryDelay: 3000,
        secure: false
      })
    );

    this.nodes.first()?.connect();
  }
}
