import Command from "../../structures/Command"
import Emojis from '../../utils/Emojis'
import { Message } from 'discord.js'
import Client from "../../client";

module.exports = class Raios extends Command {
  
  client: Client

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "raios";
    this.category = "Comandos de Economia";
    this.description = "Veja quantos raios você/usuário tem.";
    this.usage = "raios";
    this.aliases = ['atm', 'bal', 'balance'];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message: Message, args: string[], prefix: string) {

    try {

      let USER;

      if(!args.length) {
          USER = message.author
      } else {
          USER = await this.client.utils.findUser(args.join(' '), message.guild)
      }

      if(!USER) {
        message.reply(`:sob: Procurei em toda parte, mas não encontrei um usuário que se chame **${args[0]}**. Não se esqueça que eu procuro por nomes, IDs ou menções.`)
        return
      }
      
      const doc = await this.client.userDB.findOne({ idU: USER!.id})

      if(!doc) {
        message.reply(`${Emojis.Errado} ${USER!.id == message.author.id ? 'Você' : 'O usuário'} não tem seus documentos criados no meu banco de dados, ${USER!.id == message.author.id ? 'use o comando novamente' : 'antes ele precisa usar algum comando'}.`)
        return
      }

      message.reply(`:money_with_wings: ${USER!.id == message.author.id ? 'Você' : '**' + USER!.username + '**'} tem **${doc!.raios} raios**`)

    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};