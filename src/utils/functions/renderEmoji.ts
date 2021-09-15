import emoji from "node-canvas-with-twemoji-and-discord-emoji"
import { NodeCanvasRenderingContext2D } from 'canvas'

export default async (ctx: NodeCanvasRenderingContext2D, message: string, x: number, y: number) => {
  return await emoji.fillTextWithTwemoji(ctx, message, x, y);
};