import { Message, MessageReaction, User } from 'discord.js'


import Command from "../../structures/Command"
import Emojis from '../../utils/Emojis'
import Client from "../../structures/Client";
import { setTimeout } from 'timers';
import ClientEmbed from '../../structures/ClientEmbed';
let confirm: string[] = []

module.exports = class Coinflip extends Command {
  
  client: Client

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "coinflip";
    this.category = "Comandos de Economia";
    this.description = "Gire a moeda e teste sua sorte, será que vai ganhar os raios de seus amigos?";
    this.usage = "coinflip bet";
    this.aliases = ['flipcoin', 'girarmoeda', 'caracoroa'];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message: Message, args: string[], prefix: string) {

    try {

      const moeda = [
        { lado: "Cara", chance: 50 },
        { lado: "Coroa", chance: 50 },
      ]

      if(!args[0]) {
        switch (this.client.utils.createRandom(moeda).lado) {
          case 'Cara':
            message.reply(`:coin: **Cara**`)
          break
          case 'Coroa':
            message.reply(`:coin: **Coroa**`)
          break
        }
        return
      }

      if(['bet', 'apostar'].includes(args[0].toLowerCase())) {
        let USER: User | null;

        const comando = this.client.commands.get('coinflip')

        const embed = new ClientEmbed(message.author)
        .setTitle(`Como usar? \`${prefix}${comando!.usage}\``)
        .setDescription(`${comando!.description}`)
        .addField(`:computer: Usando`, `:pencil2: **Apostar 1000 raios com a melhor bot do discord (ou quase)**\n\`${prefix}coinflip bet @Shiota 1k\`\n:pencil2: **Apostar 100 raios comigo pelo ID**\n\`${prefix}coinflip bet ${this.client.user!.id} 100\`\n:pencil2: **Apostar 500 raios comigo pelo nome**\n\`${prefix}coinflip bet Shiota 500\``)
        .addField(`:repeat: Apelidos`, `${comando?.aliases.map(x => `\`${prefix}${x} bet\``).join(', ') || `\`Não tem\``}`)

        if(!args[1]) {
          message.reply({ embeds: [embed] })
          return
        } else {
          USER = await this.client.utils.findUser(args[1], message.guild)
        }

        if(!USER) {
          message.reply(`:sob: Procurei em toda parte, mas não encontrei o usuário. Não se esqueça que eu procuro por **nomes, IDs ou menções**.`)
          return
        }

        if(USER!.id == message.author.id) {
          message.reply(`${Emojis.Errado} Como você quer apostar com você mesmo? Isso é impossível.`)
          return
        }

        if(!message.guild!.members.cache.get(USER!.id)) {
          message.reply(`${Emojis.Errado} **${USER!.username}** não está neste servidor, eu não sou mágica para fazer ele aceitar sua aposta sem entrar neste servidor :woman_mage:`)
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

        const raios = Number(args[2]) ? this.client.utils.convertNumber(args[2]) : args[2]

        if(!raios) {
          message.reply({ embeds: [embed] })
          return
        }

        if(!Number(raios)) {
          message.reply(`${Emojis.Errado} Eu não conheço o número \`${raios}\` ainda, sinto muito.`)
          return
        }

        if(raios < 50) {
          message.reply(`${Emojis.Errado} A aposta mínima é **50 raios**, não vale de nada apostar menos que isso né?`)
          return
        }

        if(doc!.raios < raios) {
          message.reply(`${Emojis.Errado} Como você quer apostar uma quantia que você não tem? Aposte um valor mais baixo.`)
          return
        }

        if(target!.raios < raios) {
          message.reply(`${Emojis.Errado} **${USER.username}** não tem raios o suficiente para essa aposta...`)
          return
        }

        const msg = await message.channel.send(`:moneybag: ${USER}, **${message.author.username}** quer te fazer uma aposta! Ambos colocaram **${raios} raios**. Se cair **Cara** você ganha **${raios} raios**, mas se cair **Coroa**, **${message.author.username}** ganha **${raios} raios**.\n:trophy: Para aceitar a aposta, os dois cliquem em :white_check_mark:.`)
        msg.react('✅')

        const filtro = (b: MessageReaction, user: User) => b.emoji.name == '✅' && !user.bot && user.id == message.author.id || user.id == USER!.id
        
        const collector = msg.createReactionCollector({ filter: filtro, max: 60 * 1000 })

        const timeout = setTimeout(() => {
          msg.delete()
          collector.stop()
        }, 60 * 1000)

        collector.on(`collect`, async (collected, user) => {

          clearTimeout(timeout)

          if(confirm.some(uu => uu == user.id)) return
          confirm.push(user.id)

          if(confirm.length >= 2) {

            collector.stop()

            await this.client.userDB.updateOne({ idU: message.author.id }, {$set: { raios: doc!.raios - Number(raios) }})
            await this.client.userDB.updateOne({ idU: USER!.id }, {$set: { raios: target!.raios - Number(raios) }})


            switch (this.client.utils.createRandom(moeda).lado) {
              case 'Cara':
                message.channel.send(`:coin: **Cara**, ${USER} ganhou **${raios} raios**.`)
                await this.client.userDB.updateOne({ idU: USER!.id }, {$set: { raios: target!.raios + Number(raios) }})
              break
              case 'Coroa':
                message.channel.send(`:coin: **Coroa**, ${message.author} ganhou **${raios} raios**.`)
                await this.client.userDB.updateOne({ idU: message.author.id }, {$set: { raios: doc!.raios + Number(raios) }})
              break
            }
            confirm = []
            return
          }
        })
        return
      }

    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};