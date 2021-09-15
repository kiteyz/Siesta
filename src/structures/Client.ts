import { Client, Collection, ClientOptions, Guild, User } from "discord.js"
import { NodeOptions } from "erela.js"
import { promisify } from "util"
import { Color } from "colors"
import { Utils } from "../typings/index"

import moveArray from '../utils/functions/moveArray'
import removeDupeChars from '../utils/functions/removeDupeChars'
import breakLine from '../utils/functions/breakLine'
import toAbbrev from '../utils/functions/toAbbrev'
import renderEmoji from '../utils/functions/renderEmoji'
import convertNumber from '../utils/functions/convertNumber'
import guildDatabase from '../models/guild'
import commandDatabase from '../models/command'
import userDatabase from '../models/user'
import msToHour from "../utils/functions/msToHour"
import createRandom from "../utils/functions/createRandom"
import Command from '../../src/structures/Command'
import Music from '../structures/Music'
import klaw from "klaw"
import path from "path"

const readdir = promisify(require("fs").readdir);

export default class Main extends Client {
  music: Music
  utils: Utils
  color: Color
  guildDB: typeof guildDatabase
  userDB: typeof userDatabase
  commandDB: typeof commandDatabase
  
  commands: Collection<string, Command>
  aliases: Collection<string, string>

  constructor(options: ClientOptions) {
    super(options);

    const nodes: NodeOptions[] = [
      {
        identifier: 'Node 1',
        host: process.env.LAVALINKHOST as string,
        port: Number(process.env.LAVALINKPORT),
        password: process.env.LAVALINKPASSWORD as string,
        retryAmount: 10,
        retryDelay: 3000,
        secure: false
      }
    ];
  
    this.music = new Music(this, nodes);
  
    this.on("raw", (d) => this.music.updateVoiceState(d));

    this.commands = new Collection();
    this.aliases = new Collection();
    this.guildDB = guildDatabase
    this.userDB = userDatabase
    this.commandDB = commandDatabase
    
    this.color = require('colors')

    const findUser = async (param: string, guild: Guild | null): Promise<User | null> => {
      let user: User | null | undefined

      if (/<@!?\d{17,18}>/.test(param)) {
        const matched = param.match(/\d{17,18}/)?.[0]

        if(matched) param = matched
      }

      if (/\d{17,18}/.test(param)) {
        try {
          user = this.users.cache.get(param) || await this.users.fetch(param);
        } catch { }
      }

      if(!guild) return null

      if (!user && /^#?[0-9]{4}$/g.test(param)) {
        user = guild.members.cache.find(m => m.user.discriminator === param.replace(/#/, ''))?.user;
      }

      if (!user) {
        let startsWith = false;
        const lowerCaseParam = param.toLowerCase();

        for (const m of guild.members.cache.values()) {
          if ((m.nickname && (m.nickname === param || m.nickname.toLowerCase() === param.toLowerCase())) || m.user.username === param || m.user.username.toLowerCase() === param.toLowerCase()) {
            user = m.user;
            break;
          }

          if ((m.nickname && m.nickname.startsWith(lowerCaseParam)) || m.user.username.toLowerCase().startsWith(lowerCaseParam)) {
            user = m.user;
            startsWith = true;
            continue;
          }

          if (!startsWith && (m.nickname && m.nickname.toLowerCase().includes(lowerCaseParam)) || m.user.username.toLowerCase().includes(lowerCaseParam)) {
            user = m.user;
          }
        }
      }
      return user || null;
    }

    this.utils = {
      findUser,
      msToHour,
      createRandom,
      convertNumber,
      toAbbrev,
      renderEmoji,
      breakLine,
      removeDupeChars,
      moveArray
    }
  }

  load(commandPath: string, commandName: string) {
    const props = new (require(`${commandPath}/${commandName}`))(this);
    props.location = commandPath;

    if (props.init) {
      props.init(this);
    }

      this.commands.set(props.name, props);
    props.aliases.forEach((aliases: string) => {
      this.aliases.set(aliases, props.name);
    });
    return false;
  }

  async onLoad(client: Main) {
    klaw("src/commands").on("data", (time) => {
      const cmdFile = path.parse(time.path);
      if (!cmdFile.ext || cmdFile.ext !== ".ts") return;
      const response = client.load(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
      if (response) return;
    });
  
    const eventFiles = await readdir(`./src/events`);
    eventFiles.forEach((file: string) => {
      const eventName = file.split(".")[0];
      const event = require(`../events/${file}`).default;
      client.on(eventName, (...args) => new event(client).run(...args));
      delete require.cache[require.resolve(`../events/${file}`)];
    });
  }
}