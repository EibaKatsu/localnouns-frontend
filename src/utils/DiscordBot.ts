import { Client, Intents, TextChannel } from "discord.js";

export class DiscordBot {
  client: Client;
  token: string;

  constructor(_token: string) {
    this.client = new Client({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    });
    this.token = _token;
  }

  login() {
    return this.client.login(this.token);
  }

  async sendMessage(channelId: string, message: string, imagePath?: string) {
    const channel = await this.client.channels.fetch(channelId);
    if (!channel) throw new Error("Channel not found");
    if (channel.isText()) {
      const textChannel = channel as TextChannel;
      if (imagePath) {
        return textChannel.send({ content: message, files: [imagePath] });
      } else {
        return textChannel.send({ content: message });
      }
    } else {
      throw new Error("Channel is not a text channel");
    }
  }

  logout() {
    return this.client.destroy();
  }
}
