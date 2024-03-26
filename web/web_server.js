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
const filePath = path.join(directoryPath, 'prompt3.txt');
const fileContent = fs.readFileSync(filePath, 'utf8');
console.log(fileContent);
const AI_PROMPT = fileContent

const WEB_PORT = 3005


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

const PORT = process.env.PORT || WEB_PORT;
app.listen(PORT, () => {
  console.log('Server are running on http://localhost:${PORT}');
});
