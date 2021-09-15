import Command from "../../structures/Command";
import { ColorResolvable, Message, MessageEmbed } from "discord.js";
import Client from "../../client";
import Emojis from "../../utils/Emojis";

module.exports = class Grab extends Command {
  client: Client;

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "grab";
    this.category = "Comandos de Música";
    this.description = "Está tocando uma música muito divertida? Salve essa música nas nossas mensagens diretas.";
    this.usage = "grab";
    this.aliases = ["save"];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message: Message, args: string[], prefix: string) {

    const player = this.client.music.players.get(message.guild!.id);

    if (!player) {
    message.reply(`${Emojis.Errado} Ei bobinho, eu não estou tocando nada neste servidor!`)
    return
    }

    message.channel.send(`:musical_note: Que legal! Vejo que você adorou a música tocando atualmente, muito bem, vou salvar ela para você em nossas **mensagens diretas**.`)

    message.author.send({ embeds: [new MessageEmbed()
        .setColor(process.env.EMBED_COLOR as ColorResolvable)
        .setDescription(`**Aqui está!** Uma música que você adorou. :heart_on_fire:\n\n:notes: [${player.queue.current!.title}](${player.queue.current!.uri})`)] 
    }).catch(() => {
        message.channel.send(`:worried: Sinto muito, alguma coisa aconteceu e eu não consegui enviar a música nas mensagens diretas, **verifique se elas estão ligadas**.`)
    })
  }
};
