import { MessageAttachment, Message, User } from 'discord.js'

import ClientEmbed from '../../structures/ClientEmbed'
import Command from "../../structures/Command"
import Client from "../../client";
import Emojis from '../../utils/Emojis'
import Canvas from 'canvas'
Canvas.registerFont("src/assets/fonts/LEMONMILK-Bold.otf", { family: "Lemon" })
Canvas.registerFont("src/assets/fonts/Montserrat-Bold.otf", { family: "Mine" })

module.exports = class Profile extends Command {
  
  client: Client

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "profile";
    this.category = "Dev";
    this.description = "Eu amo esse comando! Mostra seu perfil com informações interessantes como raios e reps.";
    this.usage = "profile";
    this.aliases = ["perfil"];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message: Message, args: string[], prefix: string) {

    try {
    
        let USER: User | null;

        if(!args.length) {
            USER = message.author
        } else {
            USER = await this.client.utils.findUser(args.join(' '), message.guild)
        }

        if(!USER) {
            message.reply(`:sob: Procurei em toda parte, mas não encontrei um usuário que se chame **${args.join(' ')}**. Não se esqueça que eu procuro por nomes, IDs ou menções.`)
            return
          }

        //Definições
        const doc = await this.client.userDB.findOne({ idU: USER!.id })
        const canvas = Canvas.createCanvas(800, 600)
        const ctx = canvas.getContext("2d")

        //Avatar
        const avatar = await Canvas.loadImage(USER!.displayAvatarURL({ format: "jpeg", size: 2048 }))
        ctx.arc(75, 62, 50, -15, Math.PI * 2, true)
        ctx.drawImage(avatar, 34, 150, 215, 220)

        //Wallpaper
        const wallpaper = await Canvas.loadImage("./src/assets/images/wallpaper/wallpaper1.png")
        ctx.drawImage(wallpaper, 0, 0, 800, 600)

        //BackGound
        const background = await Canvas.loadImage(`./src/assets/images/perfil/${doc! ? doc!.profile.theme == 'branco' ? 'branco' : 'preto' : 'branco'}.png`)
        ctx.drawImage(background, 0, 0, 800, 600)

        //Raios
        ctx.font = '15px "Mine"';
        ctx.fillStyle = `#${doc ? doc!.profile.theme == 'branco' ? '757575' : 'c5c3c3' : '757575'}`;
        ctx.fillText(`RAIOS`, 385, 395);

        ctx.font = '18px "Lemon"';
        ctx.fillStyle = "#353536";
        ctx.fillText(`${doc && doc.raios != 0 ? doc.raios : "0"}`, 386, 420);

        //Reputações
        ctx.font = '15px "Mine"';
        ctx.fillStyle = `#${doc ? doc!.profile.theme == 'branco' ? '757575' : 'c5c3c3' : '757575'}`;
        ctx.fillText(`REPS`, 385, 445);

        ctx.font = '18px "Lemon"';
        ctx.fillStyle = "#353536";
        ctx.fillText(`Em Breve`, 386, 467);

        //Sobre Mim
        ctx.textAlign = "left";
        ctx.font = '15px "Cool"';
        ctx.fillStyle = "#000000";
        
        ctx.fillText(`${doc ? doc!.profile.aboutme ? doc!.profile.aboutme : `Sou um grande amigo da Siesta :3\nSabia que você pode alterar esta mensagem usando ${prefix}aboutme ?` : `Sou um grande amigo da Siesta :3\nSabia que você pode alterar esta mensagem usando ${prefix}aboutme ?`}`, 345, 509)

        //Badges
        const flags = USER!.flags === null ? "" : USER!.flags.toArray().join('').replace('EARLY_SUPPORTER', '<:bot_badgeearlysupporter:590944204411109392>').replace("HOUSE_BRAVERY", "<:bravery:831305102954070047>").replace("HOUSE_BRILLIANCE", "<:brilliance:831305103000207400>").replace("HOUSE_BALANCE", "<:balance:831305102881980456>").replace('EARLY_VERIFIED_BOT_DEVELOPER', '<:developer:831305103042019399>').replace("VERIFIED_BOT", "<:check:869973904553291837>")
        ctx.textAlign = "left";
        ctx.font = '30px "Mine"';
        await this.client.utils.renderEmoji(ctx, flags.split(",").join(""), 255, 350);

        //Username
        ctx.font = '40px "Lemon"';
        ctx.fillStyle = "#353536";
        ctx.fillText(USER.username, 265, 315)

        //Enviar Imagem
        const attach = new MessageAttachment(canvas.toBuffer(),`profile_${USER!.tag}.png`);
        message.reply({ files: [attach] });

    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};