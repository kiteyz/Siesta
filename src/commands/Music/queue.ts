import Command from "../../structures/Command";
import { Message, User, Emoji, MessageReaction } from "discord.js";
import Client from "../../client";
import Emojis from "../../utils/Emojis";
import ClientEmbed from "../../structures/ClientEmbed";

module.exports = class Queue extends Command {
  client: Client;

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "queue";
    this.category = "Comandos de Música";
    this.description = "Mostra todas as músicas da fila.";
    this.usage = "queue";
    this.aliases = ["q"];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message: Message, args: string[], prefix: string) {

    try {

      const player = this.client.music.players.get(message.guild!.id);

      if (!player || player.queue.length <= 0) {
        message.reply(`:sob: Essa não, a fila não tem nada.`);
        return;
      }

      const getSongDetails = (pos: number, pos2: number) => {
        const data = [];

        for (; pos <= pos2 && player.queue[pos]; pos++) {
          const req = player.queue[pos].requester;
          data.push(
            `**${pos + 1}** - \`${
              player.queue[pos].title.length >= 30
                ? player.queue[pos].title.slice(0, 30) + "..."
                : player.queue[pos].title
            }\` [${req}]`
          );
        }
        return data.join("\n");
      };

      const desc = [
        `Tocando: **${player.queue.current!.title.length >= 30 ? player.queue.current!.title.slice(0, 30) + "..." : player.queue.current!.title}**`,
        `Duração: \`${this.client.utils.msToHour(player.queue.duration)}\`\n`,
        `**Fila:**\n${getSongDetails(0, 9)}\n${player.queue.length > 10 ? `E mais **${player.queue.length - 10} músicas**.` : ''}`,
      ];

      const embed = new ClientEmbed(message.author)
        .setTitle(`Lista de Reprodução`)
        .setDescription(desc.join("\n"));

      message.reply({ embeds: [embed] })

    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};
