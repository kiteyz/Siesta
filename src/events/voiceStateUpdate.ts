import { TextChannel, VoiceState } from 'discord.js';
import { clearTimeout, setTimeout } from 'timers';
import Client from '../structures/Client'

export default class {

    client: Client

  constructor(client: Client) {
    this.client = client;
  }

  async run(oldState: VoiceState, newState: VoiceState) {

    const player = this.client.music.players.get(oldState.guild.id);

    if(!player) return

    const channel = this.client.channels.cache.get(player.textChannel as string) as TextChannel;


    if(!oldState.member!.user.bot && (oldState.channel && oldState.channel!.id == player.voiceChannel) || (oldState.channel && newState.channel && oldState.channel.id != newState.channel.id && oldState.channel.id == player.voiceChannel)) {

      if(!oldState.channel!.members.filter(m => !m.user.bot).size) {

      player.pause(true)

      const msg = await channel.send(`:face_with_raised_eyebrow: Estou sozinha no canal de voz, se ninguém voltar, em **2 minutos** eu desconecto.`)

      const timeout = setTimeout(() => {

        channel.send(':wave: Fui deixada sozinha por mais de **2 minutos**, saindo do canal de voz e limpando a fila.')
        player.destroy()

        this.client.music.channelTimeouts.get(oldState.member!.guild.id)?.message.delete().catch(() => { });
        this.client.music.channelTimeouts.delete(oldState.member!.guild.id);

      }, 2 * 60 * 1000)

      this.client.music.channelTimeouts.set(oldState.member!.guild.id, { timeout, message: msg });
      } else {
        return
      }
    }

    if((!oldState.channel && newState.channel) || (oldState.channel && newState.channel && oldState.channel.id != newState.channel.id && newState.channel.id == player.voiceChannel) && !newState.member!.user.bot) {

      const player = this.client.music.players.get(newState.guild.id);

      if (!player) return;

      if(this.client.music.channelTimeouts.has(newState.member!.guild.id) && newState.channel.id == player.voiceChannel) {
        player.pause(false)
        
        const data = this.client.music.channelTimeouts.get(newState.member!.guild.id)
        if(!data) return

        clearTimeout(data.timeout)
        data.message.delete().catch(() => { })
        this.client.music.channelTimeouts.delete(newState.member!.guild.id)
      }
    }
  }
};