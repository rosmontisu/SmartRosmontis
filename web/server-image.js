const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
require('dotenv').config();

// 클라이언트 인스턴스 생성 및 인텐트 설정
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
  console.log('Bot is ready!');
});

client.on('messageCreate', async message => {
  // 봇이나 DM으로부터의 메시지는 무시
  if (!message.guild || message.author.bot) return;

  if (message.content === '!image') {
    // 이미지 URL 예시
    const imageUrl = 'https://example.com/your-image.png';

    // 로컬 파일을 사용하는 경우, 파일 경로를 지정하세요.
    // const filePath = 'path/to/your/local/image.png';
    // const file = new AttachmentBuilder(filePath).setName('LocalImage.png');

    // 이미지를 메시지로 전송
    const imageAttachment = new AttachmentBuilder(imageUrl, { name: 'example.png' });
    await message.channel.send({ content: 'Here is your image:', files: [imageAttachment] });
  }
});

// 환경 변수에서 토큰을 로드하여 봇 로그인
client.login(process.env.DISCORD_TOKEN);
