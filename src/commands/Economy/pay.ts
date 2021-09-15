import { Message, MessageReaction, User } from 'discord.js'

import ClientEmbed from '../../structures/ClientEmbed'
import Command from "../../structures/Command"
import Emojis from '../../utils/Emojis'
import Client from "../../client";
import { clearTimeout } from 'timers';

module.exports = class Pay extends Command {
  
  client: Client

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "pay";
    this.category = "Comandos de Economia";
    this.description = "Envie raios a um amigo e pague suas dívidas usando raios.";
    this.usage = "pay";
    this.aliases = ['enviar'];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message: Message, args: string[], prefix: string) {

    try {
      let USER: User | null;

      const comando = this.client.commands.get('pay')

      const embed = new ClientEmbed(message.author)
      .setTitle(`Como usar? \`${prefix}${comando!.usage}\``)
      .setDescription(`${comando!.description}`)
      .addField(`:computer: Usando`, `:pencil2: **Enviar 1000 raios para uma pessoa que te ajuda muito!**\n\`${prefix}pay @Shiota 1k\`\n:pencil2: **Enviar 1000 raios para mim pelo ID**\n\`${prefix}pay ${this.client.user!.id} 100\`\n:pencil2: **Enviar 100 raios para mim pelo nome**\n\`${prefix}pay Shiota 100\``)
      .addField(`:repeat: Apelidos`, `${comando?.aliases.map(x => `\`${prefix}${x}\``).join(', ') || `\`Não tem\``}`)

      if(!args[0]) {
        message.reply({ embeds: [embed] })
        return
      } else {
        USER = await this.client.utils.findUser(args[0], message.guild)
      }

      if(!USER) {
        message.reply(`:sob: Procurei em toda parte, mas não encontrei um usuário que se chame **${args[0]}**. Não se esqueça que eu procuro por nomes, IDs ou menções.`)
        return
      }

      if(USER!.id == message.author.id) {
        message.reply(`${Emojis.Errado} Como você quer enviar raios para você mesmo? Isso é impossível.`)
        return
      }

      const doc = await this.client.userDB.findOne({ idU: message.author.id })
      const target = await this.client.userDB.findOne({ idU: USER.id })

      if(!doc) {
        message.reply(`${Emojis.Errado} Você não tem seus documentos criados em meu banco de dados, use o comando novamente.`)
        return
      }

      if(!target) {
        message.reply(`${Emojis.Errado} **${USER!.username}** não tem seus documentos criados em meu banco de dados, antes ele precisa usar um comando.`)
        return
      }

      const raios = Number(args[1]) ? this.client.utils.convertNumber(args[1]) : args[1]

      if(!raios) {
        message.reply({ embeds: [embed] })
        return
      }

      if(!Number(raios)) {
        message.reply(`${Emojis.Errado} Eu não conheço o número \`${raios}\` ainda, sinto muito.`)
        return
      }

      if(Number(raios) < 50) {
          message.reply(`${Emojis.Errado} A quantia deve ser no mínimo **50 raios**, para que você quer enviar uma quantia tão baixa para este usuário? rs.`)
          return
      }

      if(doc.raios < Number(raios)) {
          message.reply(`${Emojis.Errado} Como você quer enviar uma quantia que você não tem? Envie um valor mais baixo.`)
          return
      }

      const msg = await message.channel.send(`:money_with_wings: ${message.author} Você tem certeza que deseja enviar **${raios} raios** para o usuário **${USER!.username}**?\n:bank: Para enviar a transferência clique no emoji :white_check_mark:. Caso você não queria apenas ignore esta mensagem, ela será apagada em **30 segundos**.`)

      msg.react('✅')

      const filtro = (b: MessageReaction, user: User) => b.emoji.name == '✅' && !user.bot && user.id == message.author.id

      const collector = msg.createReactionCollector({ filter: filtro, time: 30 * 1000 })

      const timeout = setTimeout(() => {
        msg.delete()
        collector.stop()
      }, 30 * 1000)

      collector.on(`collect`, async (collected) => {
        clearTimeout(timeout)

        await this.client.userDB.updateOne({ idU: USER!.id }, {$set: { raios: target.raios + Number(raios) }})
        await this.client.userDB.updateOne({ idU: message.author.id}, {$set: { raios: doc.raios - Number(raios) }})

        message.channel.send(`:white_check_mark: Transação concluída com sucesso, você enviou **${raios} raios** para a conta de **${USER!.username}**.`)
        collector.stop()
      })

    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
}