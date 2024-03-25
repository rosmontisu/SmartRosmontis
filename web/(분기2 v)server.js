const express = require('express');
const fs = require('fs'); // 파일 시스템 접근 모듈
const path = require('path');
const axios = require('axios');
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
require('dotenv').config();

const app = express();
// JSON 요청 본문을 파싱하기 위한 미들웨어 설정
app.use(express.json());

const API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GPT_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

// 짧은 프롬프트는 .env로 가져옵니다.
//const AI_PROMPT = process.env.AI_PROMPT; 

// 긴 프롬프트는 prompt.txt로 가져옵니다
const directoryPath = __dirname;
const filePath = path.join(directoryPath, 'prompt3.txt');
//const filePath = path.join(directoryPath, 'prompt4.txt');
const fileContent = fs.readFileSync(filePath, 'utf8');
console.log(fileContent);
const AI_PROMPT = fileContent

// tts 함수 구현
async function textToSpeech(text) {
  try {
    const response = await axios.post(
      `${GPT_API_ENDPOINT}`,
      {
        model: "tts-1", // 현재 예시에서는 텍스트 모델을 사용하고 있으나, 실제 TTS 모델로 변경해야 합니다.
        input: text,
        // 여기에 필요한 TTS 매개변수 추가
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // API 응답에서 음성 데이터 추출
    // 주의: 실제 응답 구조는 OpenAI TTS API 문서를 참조해야 합니다.
    const audioData = response.data; // 응답 구조에 따라 수정 필요

    // 음성 데이터를 MP3 파일로 저장
    fs.writeFileSync('speech.mp3', audioData, 'binary');
    console.log('음성 파일이 speech.mp3로 저장되었습니다.');
  } catch (error) {
    console.error('텍스트를 음성으로 변환하는 데 실패했습니다:', error);
  }
}


// 봇 클라이언트 생성
const client = new Client({ intents: [
  GatewayIntentBits.Guilds, 
  GatewayIntentBits.GuildMessages, 
  GatewayIntentBits.MessageContent] });


client.once('ready', () => {
    console.log('Bot is ready!');

    // 텍스트 변환을 테스트합니다
    const text = "Hello, this is a test for converting text to speech.";
    //textToSpeech(text); 임시 주석 처리
});

client.on('messageCreate', async message => {
    // 봇이나 DM으로부터의 메시지는 무시
    if (!message.guild || message.author.bot) return;


    //음성 입장 기능
    if (message.content === '/join') {
        // 메시지 작성자가 음성 채널에 없는 경우
        if (!message.member.voice.channel) {
            message.reply('You need to be in a voice channel first!');
            return;
        }

        // 음성 채널에 접속
        const connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        });

        message.reply('I have joined the voice channel!');
    }
    else {
      try {
        const response = await axios.post(GPT_API_ENDPOINT, {
          // 파인튜닝 모델 1 : ft:gpt-3.5-turbo-0125:hepari::95V281ME
          // 환각이 심함, 기초적인 대화능력이 붕괴하였음
          // model: 'ft:gpt-3.5-turbo-0125:hepari::95V281ME', 

          // gpt 4 : model: 'gpt-4-turbo-preview', 
          // token cost가 빠르게 나감

          // gpt 3.5 : model: 'gpt-3.5-turbo-0125', 
          // 가격은 싼데 말을 잘 못핢


          model: 'gpt-3.5-turbo-0125', 
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
    }
  });
    

// 환경 변수에서 토큰을 로드하여 봇 로그인
client.login(DISCORD_TOKEN);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server and Discord bot are running on http://localhost:${PORT}`);
});


console.log("현재 모델은 3.5")