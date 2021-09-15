import Command from "../../structures/Command";
import { Message, VoiceChannel } from "discord.js";
import ClientEmbed from '../../structures/ClientEmbed'
import Client from "../../client";
import Emojis from "../../utils/Emojis";

module.exports = class Remove extends Command {
  client: Client;

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "remove";
    this.category = "Comandos de Música";
    this.description = "Quando você adiciona uma música errada ou simplesmente não quer mais a música, use este comando para remover a música da fila.";
    this.usage = "remove";
    this.aliases = ["rm"];

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

      const comando = this.client.commands.get('remove')

      const embed = new ClientEmbed(message.author)
        .setTitle(`Como usar? \`${prefix}${comando!.usage}\``)
        .setDescription(`${comando!.description}`)
        .addField(`:computer: Usando`, `:pencil2: **Remover uma música da posição 2**\n\`${prefix}remove 2\``)
        .addField(`:repeat: Apelidos`, `${comando?.aliases.map(x => `\`${prefix}${x}\``).join(', ') || `\`Não tem\``}`)

      if(!Number(args[0])) {
          message.reply({ embeds: [embed] })
          return
      }

      if (player.queue.length <= 0) {
          message.reply(`:sob: Essa não, a fila não tem nada.`);
          return;
      }

      if(Number(args[0]) < 1 || Number(args[0]) > player.queue.length) {
          message.reply(`${Emojis.Errado} Ei, olhando aqui, a posição da música precisa variar de **1 á ${player.queue.length}**`)
          return
      }
      
      const voiceChannel = this.client.channels.cache.get(voiceChannelID) as VoiceChannel

      if((player.queue[parseInt(args[0]) - 1] && message.author == player.queue[parseInt(args[0]) - 1].requester) || voiceChannel.members.filter(result => !result.user.bot).size == 1) {
          player.queue.remove(Number(args[0]) - 1)
          message.channel.send(`:cd: Música de posição ${args[0]} removida.`)
      } else {
          message.reply(`${Emojis.Errado} Espera um pouco espertinho, só quem adicionou a música atual pode tirar essa música da fila.`)
      }

    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};
