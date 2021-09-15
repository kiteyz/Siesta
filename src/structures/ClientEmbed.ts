import { ColorResolvable, MessageEmbed, User } from 'discord.js'

export default class ClientEmbed extends MessageEmbed {
  constructor(user: User, data = {}) {
    super(data);
    this.setTimestamp();
    this.setColor(process.env.EMBED_COLOR as ColorResolvable)
    this.setFooter(`${user.tag}`, user.displayAvatarURL({ dynamic: true }));
  }
};
