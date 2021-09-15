import { Message } from 'discord.js'

import ClientEmbed from '../../structures/ClientEmbed'
import Command from "../../structures/Command"
import Client from "../../structures/Client";
import Emojis from '../../utils/Emojis'

module.exports = class Theme extends Command {
  
  client: Client

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "theme";
    this.category = "Dev";
    this.description = "Mude o tema do seu perfil para deixar ele do seu jeito!";
    this.usage = "theme";
    this.aliases = ["tema", "color", "cor"];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message: Message, args: string[], prefix: string) {

    try {

        if(args[0] == 'branco') {
            message.reply(`https://cdn.discordapp.com/attachments/862769159883980830/881968310080667648/profile_Siestinha4700.png`)
            return
        } else if(args[0] == 'preto') {
            message.reply(`https://cdn.discordapp.com/attachments/862769159883980830/881968688004206623/profile_Siestinha4700.png`)
            return
        } else {
            
        }
        
    } catch(err) {
        console.log(err)
        message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};