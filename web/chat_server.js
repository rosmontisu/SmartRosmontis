const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log('Discord bot is ready!');
});

client.on('messageCreate', async message => {
    if (message.author.bot || !message.content.startsWith('!')) return;

    const command = message.content.slice(1).trim();

    switch (command) {
        case 'join':
            if (message.member.voice.channel) {
                const connection = joinVoiceChannel({
                    channelId: message.member.voice.channel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator,
                });

                const player = createAudioPlayer();
                const resource = createAudioResource(path.join(__dirname, 'path/to/your/audio/file.mp3'));
                player.play(resource);
                connection.subscribe(player);

                player.on(AudioPlayerStatus.Playing, () => {
                    console.log('The audio is now playing!');
                });

                player.on('error', error => {
                    console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
                });

                await entersState(player, AudioPlayerStatus.Playing, 5e3);
                message.reply('Playing audio in your voice channel!');
            } else {
                message.reply('You need to join a voice channel first!');
            }
            break;

        // 추가 명령어 처리를 여기에 구현할 수 있습니다.
    }
});

client.login(DISCORD_TOKEN);

// Express 서버 설정
app.get('/', (req, res) => {
    res.send('Server is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
