import Command from "../../structures/Command";
import { Message } from "discord.js";
import Client from "../../structures/Client";
import Emojis from "../../utils/Emojis";
let votes: string[] = []

module.exports = class Skip extends Command {
  client: Client;

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "skip";
    this.category = "Comandos de Música";
    this.description = "Não gostei dessa música, pule para próxima música da fila.";
    this.usage = "skip";
    this.aliases = ["next", "s", "voteskip"];

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

      if(message.member?.voice.selfDeaf) {
        message.reply(`${Emojis.Errado} Ei, você não pode votar para pular a música com o áudio mutado, acha que eu sou boba?`)
        return
      } 

      const requiredVotes = message.guild!.me!.voice.channel!.members.filter(x => !x.user.bot && !x.voice.selfDeaf).size

      if(votes.some(user => user === message.author.id)) return
      votes.push(message.author.id)

      if(votes.length >= requiredVotes) {
          player!.stop()

          message.channel.send(`:fast_forward: Música pulada`);
          votes = []
          return
      }
      
      message.channel.send(`Pular para próxima música? **[${votes.length}/${requiredVotes}]**`)

    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};
