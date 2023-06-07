import axios from 'axios';
import { env } from 'node:process';

export default async function createMessage(channelId: string, message: string): Promise<void> {
    await axios({
        method: "post",
        url: `https://discord.com/api/v10/channels/${channelId}/messages`,
        headers: {
            Authorization: `Bot ${env.BOT_TOKEN}`,
            "Accept-Encoding": "*"
        },
        data: {
            content: message
        }
    })
};

