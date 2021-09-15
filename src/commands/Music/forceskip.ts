import Command from "../../structures/Command";
import { Message, User} from "discord.js";
import Client from "../../structures/Client";
import Emojis from "../../utils/Emojis";

module.exports = class ForceSkip extends Command {
  client: Client;

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "forceskip";
    this.category = "Comandos de Música";
    this.description = "Força a música a pular, apenas quem adicionou a música pode usar!";
    this.usage = "forceskip";
    this.aliases = ["fskip", "fs"];

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

      const requester = player.queue.current?.requester as User

      if(requester.id != message.author.id) {
        message.reply(`${Emojis.Errado} Espera um pouco espertinho, só quem adicionou a música atual pode pular sem uma votação.`)
        return
      }

      message.channel.send(`:fast_forward: Música pulada`);
      player.stop()

    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};
