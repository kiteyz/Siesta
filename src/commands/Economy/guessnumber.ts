import { Message } from 'discord.js'

import Command from "../../structures/Command"
import Emojis from '../../utils/Emojis'
import Client from "../../client";
import ClientEmbed from '../../structures/ClientEmbed'

module.exports = class GuessNumber extends Command {
  
  client: Client

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "guessnumber";
    this.category = "Comandos de Economia";
    this.description = "Chute um número de 1 a 10, se acertar o número que eu pensei, você ganha raios! Mas se errar... você perde alguns raios.";
    this.usage = "guessnumber";
    this.aliases = ["adivinharnumero", "adivinharnúmero"];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message: Message, args: string[], prefix: string) {

    const number = args[0]

    const comando = this.client.commands.get('guessnumber')

    const embed = new ClientEmbed(message.author)
    .setTitle(`Como usar? \`${prefix}${comando!.usage}\``)
    .setDescription(`${comando!.description}`)
    .addField(`:computer: Usando`, `:pencil2: **Chutar o número 7 e torcer para acertar**\n\`${prefix}guessnumber 7\``)
    .addField(`:repeat: Apelidos`, `${comando?.aliases.map(x => `\`${prefix}${x}\``).join(', ') || `\`Não tem\``}`)

    if(!number) {
        message.reply({ embeds: [embed] })
        return
    }

    if(Number(number) < 1 || Number(number) > 10) {
      message.reply(`${Emojis.Errado} Espera ai espertinho, o número precisa ser entre **1 e 10**, acha que me engana?`)
      return
    }

    const doc = await this.client.userDB.findOne({ idU: message.author.id })

    const responses = [
        'Você não está com sorte, eu pensei no número {number}',
        'Você chegou perto, mas eu pensei no número {number}',
        'Dessa vez não foi, eu pensei no número {number}'
    ]

    const randomResponses = responses[Math.floor(Math.random() * responses.length)]
    const randomNumber = Math.floor(Math.random() * (10 - 1) + 1)

    if(Number(number) == randomNumber) {
        message.channel.send(`:money_with_wings: Parabéns! Você acertou o número que eu pensei, por isso te **dei 1000 raios**.`)
        await this.client.userDB.updateOne({ idU: message.author.id }, {$set: {raios: doc!.raios + 1000 }})

        return
    } else {
        message.channel.send(`:sob: ${randomResponses.replace(`{number}`, `${randomNumber}`)}, por isso você **perdeu 100 raios**.`)
        await this.client.userDB.updateOne({ idU: message.author.id }, {$set: {raios: doc!.raios - 100 }})
        
        return
    }
  }
};