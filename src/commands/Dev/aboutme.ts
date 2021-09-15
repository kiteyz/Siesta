import { Message } from 'discord.js'

import ClientEmbed from '../../structures/ClientEmbed'
import Command from "../../structures/Command"
import Client from "../../structures/Client";
import Emojis from '../../utils/Emojis'

module.exports = class Aboutme extends Command {
  
  client: Client

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "aboutme";
    this.category = "Dev";
    this.description = "Fale um pouco sobre você para deixar seu perfil com a sua cara!";
    this.usage = "aboutme";
    this.aliases = ["sobremim", "sb", "about"];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message: Message, args: string[], prefix: string) {

    try {
    
        const about = args.join(' ')

        const comando = this.client.commands.get('aboutme')

        const embed = new ClientEmbed(message.author)
        .setTitle(`Como usar? \`${prefix}${comando!.usage}\``)
        .setDescription(`${comando!.description}`)
        .addField(`:computer: Usando`, `:pencil2: **Mudar meu sobremim para ficar incrível**\n\`${prefix}aboutme Eu sou uma pessoa muito legal e fofa :3\``)
        .addField(`:repeat: Apelidos`, `${comando?.aliases.map(x => `\`${prefix}${x}\``).join(', ') || `\`Não tem\``}`)

        if(!about) {
            message.reply({ embeds: [embed] })
            return
        }

        if(about.length > 100) {
            message.reply(`${Emojis.Errado} Ei bobinho, esse sobre mim é muito grande! Use no máximo **100 caracteres**.`)
            return
        }

        const doc = await this.client.userDB.findOne({ idU: message.author.id })

        if(!doc) {
            message.reply(`${Emojis.Errado} Você não tem seus documentos criados em meu banco de dados, use o comando novamente.`)
            return
        }

        if(about == doc!.profile.aboutme) {
            message.reply(`${Emojis.Errado} Ei, você não pode colocar um sobre mim igual ao setado atualmente, acha que eu sou boba?`)
        }

        message.reply(`${Emojis.Certo} Seu sobre mim foi alterado com sucesso.`)
        await this.client.userDB.updateOne({ idU: message.author.id }, {$set: {'profile.aboutme': about }})
        
    } catch(err) {
        console.log(err)
        message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};