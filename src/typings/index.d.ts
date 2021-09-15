import { Message, Guild, User } from 'discord.js'
import { NodeCanvasRenderingContext2D } from 'canvas'

export interface Timeouts {
  timeout: NodeJS.Timeout;
  message: Message;
}

export interface Utils {
  findUser: (param: string, guild: Guild | null) => Promise<User | null>
  msToHour: (time: number) => string;
  createRandom: (array: any[]) => any
  convertNumber: (num: string) => any
  toAbbrev: (num: number) => string
  renderEmoji: (ctx: NodeCanvasRenderingContext2D, message: string, x: number, y: number) => Promise<void>
  breakLine: (string: string, maxCharLengthPerLine: number) => string
  removeDupeChars: (string: string, bool: boolean) => string
  moveArray: (array: any[], from: number, to: number) => any[] | undefined
}

declare module 'erela.js' {
  export interface Player {
    lastPlayingMsgID?: string;
  }
}