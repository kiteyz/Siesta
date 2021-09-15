import Client from "../client";
import { Message, MessageButton, MessageActionRow } from "discord.js";
import ClientEmbed from "../structures/ClientEmbed";
import { setTimeout } from "timers";
const cooldown = new Set()

export default class {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async run(message: Message) {
    try {

      if (message.author.bot) return;

      const GetMention = (id: string) => new RegExp(`^<@!?${id}>( |)$`);

      const server = await this.client.guildDB.findOne({ idS: message.guild!.id })

      const user = await this.client.userDB.findOne({ idU: message.author.id })

      const prefix = (server?.prefix) || process.env.PREFIX as string;

      if (message.content.match(GetMention(this.client.user!.id))) {
        const row = new MessageActionRow()
          .addComponents(new MessageButton()
              .setLabel(`Meu Convite`)
              .setStyle("LINK")
              .setURL(`https://discord.com/oauth2/authorize?client_id=${this.client.user!.id}&permissions=3460168&scope=bot`))
          .addComponents(new MessageButton()
              .setLabel(`Comunidade`)
              .setStyle("LINK")
              .setURL("https://discord.gg/XGupVn2b5k"));

        const embed = new ClientEmbed(message.author)
          .setTitle(`👋 Olá ${message.author.username}`)
          .setDescription(`🧚‍♀️ **|** Uma simples bot brasileira criada para interagir com seus membros.\n🧙‍♀️ **|** Meu prefixo é **${prefix}**\n🎗️ **|** Use **${prefix}help**`)
          .setThumbnail(this.client.user!.avatarURL({ size: 2048}) as string)

        message.reply({ embeds: [embed], components: [row] });
      } 

      if(server) {

        if(user) {

          if (message.content.toLowerCase().indexOf(prefix) !== 0) return;

          const args = message.content.slice(prefix.length).trim().split(/ +/g);

          const command = args.shift()?.toLowerCase();

          if (!command) return;

          const cmd =
            this.client.commands.get(command) ||
            this.client.commands.get(this.client.aliases.get(command) || "");

          if (!cmd) return

          if(cooldown.has(message.author.id)) {
            message.reply(`:stopwatch: Calma ai! Aguarde **alguns segundos** para usar um comando novamente.`)
            return
          }

          const commandC = await this.client.commandDB.findOne({ idC: cmd.name })

          if(commandC) {

            if(message.author.id != '750503478584934410' && commandC.maintenance) {
              message.reply(`:warning: Este comando se encontra atualmente em manutenção.`)
              return
            }

          cmd.run(message, args, prefix);

          if(message.author.id != '750503478584934410') {
            cooldown.add(message.author.id)

            setTimeout(() => {
              cooldown.delete(message.author.id)
            }, 5 * 1000)
          }

          } else {
            this.client.commandDB.create({ idC: cmd.name })
          }

        } else {
          this.client.userDB.create({ idU: message.author.id })
        }

      } else {
        this.client.guildDB.create({ idS: message.guild!.id })
      }
      
    } catch (err) {
      console.error(err);
    }
  }
}
