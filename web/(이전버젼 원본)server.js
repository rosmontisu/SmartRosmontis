const express = require('express');
const fs = require('fs'); // 파일 시스템 접근 모듈
const path = require('path');
const axios = require('axios');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();



const app = express();
// JSON 요청 본문을 파싱하기 위한 미들웨어 설정
app.use(express.json());

const API_KEY = process.env.OPENAI_API_KEY;
const GPT_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;


// 짧은 프롬프트는 .env로 가져옵니다.
//const AI_PROMPT = process.env.AI_PROMPT; 

// 긴 프롬프트는 prompt.txt로 가져옵니다
const directoryPath = __dirname;
const filePath = path.join(directoryPath, 'prompt.txt');
const fileContent = fs.readFileSync(filePath, 'utf8');
console.log(fileContent);
const AI_PROMPT = fileContent


console.log(process.env.OPENAI_API_KEY); // 디버깅 목적으로만 사용하고 실제 코드에는 포함시키지 마세요.
console.log(process.env.DISCORD_TOKEN); // 디버깅 목적으로만 사용하고 실제 코드에는 포함시키지 마세요.
console.log(GPT_API_ENDPOINT); // 디버깅 목적으로만 사용하고 실제 코드에는 포함시키지 마세요.
console.log(AI_PROMPT)


// 정적 파일을 위한 경로 설정
app.use(express.static(path.join(__dirname, 'public')));

// 루트 경로에 대한 GET 요청 처리
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 사용자로부터 챗봇 메시지를 받는 POST 요청 처리
app.post('/chat', async (req, res) => {
  const { message } = req.body;
  
  try {
    const response = await axios.post(GPT_API_ENDPOINT, {
      model: 'gpt-3.5-turbo',
      messages: [
        {"role": "system", "content": AI_PROMPT},
        {"role": "user", "content": message}
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const botMessage = response.data.choices[0].message.content;
    res.json({ reply: botMessage });
    console.log(botMessage);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch response from OpenAI' });
  }
});

// 디스코드 봇 클라이언트 생성 및 이벤트 핸들러 설정
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// 지정된 이벤트 내에서 1번만 작동합니다 .once()
client.once('ready', () => {
  console.log('Discord bot is ready!');
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  try {
    const response = await axios.post(GPT_API_ENDPOINT, {
      // 파인튜닝 모델 1 : ft:gpt-3.5-turbo-0125:hepari::95V281ME
      // 환각이 심함, 기초적인 대화능력이 붕괴하였음
      // model: 'ft:gpt-3.5-turbo-0125:hepari::95V281ME', 
      model: 'gpt-4-turbo-preview', 
      messages: [
        {"role": "system", "content": AI_PROMPT},
        {"role": "user", "content": message.content}
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const botReply = response.data.choices[0].message.content;
    await message.reply(botReply);
    console.log(message.content)
    console.log(botReply)
    console.log("---------------------------------------------------------------")

  } catch (error) {
    console.error('Error responding to message: ', error);
  }
});

client.login(DISCORD_TOKEN);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server and Discord bot are running on http://localhost:${PORT}`);
});
