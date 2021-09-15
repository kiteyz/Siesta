import Command from "../../structures/Command";
import { Message } from "discord.js";
import Client from "../../client";
import Emojis from "../../utils/Emojis";
import ClientEmbed from '../../structures/ClientEmbed'

module.exports = class Skipto extends Command {
  client: Client;

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "skipto";
    this.category = "Comandos de Música";
    this.description = "Você não gosta de várias da músicas da fila? Pule todas até uma posição escolhida por você.";
    this.usage = "skipto";
    this.aliases = ["st"];

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
        message.reply(`${Emojis.Errado} Ei, você não pode votar para pular várias músicas com o áudio mutado, acha que eu sou boba?`)
        return
      }

      const comando = this.client.commands.get('skipto')

        const embed = new ClientEmbed(message.author)
        .setTitle(`Como usar? \`${prefix}${comando!.usage}\``)
        .setDescription(`${comando!.description}`)
        .addField(`:computer: Usando`, `:pencil2: **Pular até a posição 6**\n\`${prefix}skipto 6\``)
        .addField(`:repeat: Apelidos`, `${comando?.aliases.map(x => `\`${prefix}${x}\``).join(', ') || `\`Não tem\``}`)

        if(!args[0]) {
            message.reply({ embeds: [embed] })
            return
        }

      const skipto = (end: string): void => {
        if(!end || !Number(end)) {
            message.reply(`${Emojis.Errado} Ei bobinho, você precisa colocar uma posição válida.`)
            return
        }

        if(Number(end) > player.queue.size) {
            message.reply(`${Emojis.Errado} Espera um pouco espertinho, a fila só tem **${player.queue.size} músicas**.`)
            return
        }

        if(Number(end) < 2) {
            message.reply(`${Emojis.Errado} Espera um pouco espertinho, você só pode pular da **posição 2** para frente.`)
            return
        }

        player.queue.remove(0, (Number(end) - 1))
        player.stop()
        message.channel.send(`:fast_forward: ${Number(end) - 1} músicas puladas`)
      }

      skipto(args[0])

    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};
