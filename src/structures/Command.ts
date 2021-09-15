import Client from '../structures/Client'
import { Message } from 'discord.js' 

export default class Command {

    client: Client
    name: string
    category: string
    description: string
    usage: string
    aliases: string[]
    enabled: boolean
    guildOnly: boolean
    async run (message: Message, args: string[], prefix: string) { }

    constructor(client: Client) {
      this.client = client;
  
      this.name = "Nome";
      this.category = "Categoria";
      this.description = "Descrição";
      this.usage = "Sem Informação";
      this.aliases = [];
  
      this.enabled = true;
      this.guildOnly = true;
    }
  }; 
