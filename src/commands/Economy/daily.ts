import Command from "../../structures/Command"
import Emojis from '../../utils/Emojis'
import { Message } from 'discord.js'
import Client from "../../client";

module.exports = class Daily extends Command {
  
  client: Client

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "daily";
    this.category = "Comandos de Economia";
    this.description = "Receba seus raios diários para comprar itents na loja.";
    this.usage = "daily";
    this.aliases = ['diário'];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message: Message, args: string[], prefix: string) {

    try {

      const doc = await this.client.userDB.findOne({ idU: message.author.id })

      if(!doc) {
          message.reply(`${Emojis.Errado} Você não tem seus documentos criados no meu banco de dados, use o comando novamente.`)
          return
      }

      let time = 8.64e7;
      let raios = Math.floor(Math.random() * 1500)
      let cooldown = doc?.daily.cooldown
      let atual = doc?.raios

      if(cooldown != null && time - (Date.now() - cooldown) > 0) {
          message.reply(`${Emojis.Errado} Pegue seu diário novamente <t:${Math.floor(cooldown / 1000)}:R>`)
          return
      } else {
          message.reply(`:gift: Parabéns! Hoje você coletou **${raios} raios**. :tada:`)
          await this.client.userDB.updateOne({ idU: message.author.id }, {$set: {raios: raios + atual, 'daily.cooldown': Date.now() + time }})
      }
      
    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};