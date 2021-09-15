import Command from "../../structures/Command";
import { Message, MessageAttachment } from "discord.js";
import Canvas from 'canvas'
import Client from "../../client";
import Emojis from "../../utils/Emojis";
import fetch from 'node-fetch'
Canvas.registerFont("src/assets/fonts/LEMONMILK-Bold.otf", { family: "Lemon" })
Canvas.registerFont("src/assets/fonts/Montserrat-BlackItalic.ttf", { family: "Mine" })
Canvas.registerFont("src/assets/fonts/Montserrat-Italic.ttf", { family: "Mines" })

module.exports = class NowPlaying extends Command {
  client: Client;

  constructor(client: Client) {
    super(client);
    this.client = client;

    this.name = "nowplaying";
    this.category = "Comandos de Música";
    this.description = "Mostra o batidão que está tocando.";
    this.usage = "nowplaying";
    this.aliases = ["np"];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run(message: Message, args: string[], prefix: string) {

    try {

      const player = this.client.music.players.get(message.guild!.id);

      if (!player) {
        message.reply(`${Emojis.Errado} Ei bobinho, eu não estou tocando nada neste servidor!`)
        return
      }

      var sc = require("node-album-color")

        const getColor = (url: string) => {
            return new Promise((resolve) => {
                sc.getColorsArray(url, (cb: any) => {
                    resolve(cb)
                })
            })
        }

        function componentToHex(c: number) {
          var hex = c.toString(16);
          return hex.length == 1 ? "0" + hex : hex;
        }
        
        function rgbToHex(r: number, g: number, b: number) {
          return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
        }

        let url = player.queue.current!.displayThumbnail!('maxresdefault') ?? player.queue.current!.thumbnail

        let buffer = await fetch(url).then(r => r.statusText);

        if(buffer == 'Not Found') buffer = player.queue.current!.thumbnail as string
        else buffer = player.queue.current!.displayThumbnail!('maxresdefault')

        const palette = await getColor(buffer) as any[]

        const canvas = Canvas.createCanvas(800, 325)
        const ctx = canvas.getContext('2d')
        const videoMax = player!.queue.current!.duration
        const videoNow = player!.position
        const cor1 = palette[0]
        const cor2 = palette[1]
        const primary = rgbToHex(cor1[0], cor1[1], cor1[2])
        const sec_white = rgbToHex((cor2[0] + 30 > 255 ? 255 : cor2[0] + 30), (cor2[1] + 30 > 255 ? 255 : cor2[1] + 30), (cor2[2] + 30 > 255 ? 255 : cor2[2] + 30))
        const sec_black = rgbToHex((cor2[0] - 30 < 0 ? 1 : cor2[0] - 30), (cor2[1] - 59 < 0 ? 1 : cor2[1] - 59), (cor2[2] - 59 < 0 ? 1 : (cor2[2] - 59)))

        //Fundo
        ctx.fillStyle = primary
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        //Thumb
        const thumb = await Canvas.loadImage(buffer)

        ctx.drawImage(thumb, 470, 58, 305, 180)
        ctx.fillStyle = `rgba(${String(palette[0].join(', '))}, 0.1)`
        ctx.fillRect(470, 58, 305, 180)
        
        //Barrinha
        ctx.fillStyle = sec_black
        ctx.fillRect(25, 270, 750, 5)

        ctx.fillStyle = sec_white
        ctx.fillRect(25, 270, 750/(videoMax!/videoNow), 5)

        const $var = 750/(videoMax!/videoNow)
        ctx.beginPath();
        ctx.arc(25+$var, 273, 5, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill(); 

        //Duração
        ctx.font = '15px "Lemon"';
        ctx.fillStyle = sec_white
        ctx.fillText(`${this.client.utils.msToHour(videoNow)}`, 25, 294)

        ctx.font = '15px "Lemon"';
        ctx.fillStyle = sec_white
        ctx.fillText(`${this.client.utils.msToHour(videoMax!)}`, player!.queue.current!.duration! > 3671000 ? 680 : 720, 294)

        //Título
        ctx.font = '35px "Mine"'
        ctx.fillStyle = sec_white
        ctx.fillText(player!.queue.current!.title.length > 17 ? player!.queue.current!.title.slice(0, 17) + '...' : player!.queue.current!.title, 25, 85)

        //Artista
        ctx.font = '30px "Mines"'
        ctx.fillStyle = sec_white
        ctx.fillText(player!.queue.current!.author!.length > 10 ? player!.queue.current!.author!.slice(0, 10) + '...' : player!.queue.current!.author!, 25, 135)

        //Botões
        ctx.strokeStyle = sec_white
        ctx.lineWidth = 10
        ctx.lineJoin = 'round'

        if(player?.paused) {
          ctx.beginPath()
          ctx.moveTo(205, 230)
          ctx.lineTo(235, 210)
          ctx.lineTo(205, 190)
          ctx.fill()
          ctx.closePath()
          ctx.stroke()
        } else {
          ctx.beginPath()
          ctx.moveTo(205, 230)
          ctx.lineTo(205, 190)
          ctx.fill()
          ctx.closePath()
          ctx.stroke()

          ctx.beginPath()
          ctx.moveTo(225, 230)
          ctx.lineTo(225, 190)
          ctx.fill()
          ctx.closePath()
          ctx.stroke()
        }

        ctx.beginPath()
        ctx.moveTo(275, 227)
        ctx.lineTo(297, 210)
        ctx.lineTo(275, 193)
        ctx.fill()
        ctx.closePath()
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(300, 227)
        ctx.lineTo(300, 193)
        ctx.fill()
        ctx.closePath()
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(157, 227)
        ctx.lineTo(135, 210)
        ctx.lineTo(157, 193)
        ctx.fill()
        ctx.closePath()
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(130, 227)
        ctx.lineTo(130, 193)
        ctx.fill()
        ctx.closePath()
        ctx.stroke()

        //Enviar Imagem
        const attach = new MessageAttachment(canvas.toBuffer(), `nowplaying.png`)
        message.reply({ files: [attach] })

    } catch(err) {
      console.log(err)
      message.reply(`:hammer: Sinto muito, um erro inesperado ocorreu, você pode reportar esse problema usando **${prefix}bugreport** para que meus desenvolvedores corrijam o mais rápido possível.`)
    }
  }
};