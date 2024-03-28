const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs'); // 파일 시스템 접근 모듈
const path = require('path');
const axios = require('axios');
const { Client, GatewayIntentBits, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { Console } = require('console');
require('dotenv').config();

const API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GPT_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const app = express();
const maaPort = 3001;
const userMaaID = "rosmontisu"
const rosmontisImageUrl = 'https://cdn.discordapp.com/attachments/1078390856542851152/1222096235855482920/rosmontisImage.jpg?ex=6614f8d0&is=660283d0&hm=a5dd0ffc17b8edecf62b5c8315de1d37dbdce0fc5d56890d229b1f221b87a438&'

// JSON 요청 본문을 파싱하기 위한 미들웨어 설정
app.use(express.json());
app.use(bodyParser.json());
//const AI_PROMPT = process.env.AI_PROMPT; // 짧은 프롬프트는 .env로 가져옵니다.
const directoryPath = __dirname; // 긴 프롬프트는 prompt.txt로 가져옵니다
const filePath = path.join(directoryPath, 'prompt3.txt'); // gpt 3.5 prompt
const fileContent = fs.readFileSync(filePath, 'utf8');
const AI_PROMPT = fileContent
let botReply = "너는 박사의 조수 로즈마리다."

// 실제 봇 클라이언트 생성
const client = new Client({ intents: [
  GatewayIntentBits.Guilds, 
  GatewayIntentBits.GuildMessages, 
  GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log('Bot is ready!');

    const text = "txt 음성변환 테스트 문자열입니다";
    //textToSpeech(text); 임시 주석 처리
});
client.on('messageCreate', async message => {

    // 여기서 특별한 명령어를 테스트합니다
    // dm, 봇, 첨부파일, 
    if (!message.guild || message.author.bot || message.attachments.size > 0) return;

    //음성 입장 기능
    if (message.content === 'testJoin') {    
        if (!message.member.voice.channel) { message.reply('음성 채널에 먼저 들어가주세요'); return; }
        const connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        });
        message.reply('음성 채널에 접속했습니다!');
    }
    // 이미지 새성 기능
    else if (message.content === 'testImage') {
      const imageUrl = rosmontisImageUrl; // 이미지 URL 예시
      const filePath = './rosmontisImage.jpg'; // 로컬 파일이면 경로를 지정
      //const file = new AttachmentBuilder(filePath).setName('LocalImage.png');
      const file = new AttachmentBuilder('').setName('rosmontisImage.jpg');
      const imageAttachment = new AttachmentBuilder(imageUrl, { name: 'rosmontisImage.jpg' });
      await message.channel.send({ content: '로즈마리에요:', files: [imageAttachment] });
  
    }
    // maa 연동 테스트 & 임베드 기능
    else if (message.content === 'testEmbed') {
      const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('title')
        .setURL('https://discord.js.org/')
        .setAuthor({ name: 'name', iconURL: rosmontisImageUrl, url: 'https://discord.js.org' })
        .setDescription('Some description here')
        .setThumbnail(rosmontisImageUrl)
        .addFields(
          { name: 'Regular field title', value: 'ㅂㅈㄷㄱ' },
          { name: '\u200B', value: '\u200B' },
          { name: 'Inline field title', value: 'ㅁㄴㅇㄹ', inline: true },
          { name: 'Inline field title', value: 'ㅋㅌㅊㅍ', inline: true },
        )
        // .addField('Inline field title', 'Some value here', true) // 필요에 따라 주석 해제
        .setImage(rosmontisImageUrl)
        .setTimestamp()
        .setFooter({ text: 'setFooter text ', iconURL: rosmontisImageUrl});
     
    await message.channel.send({ embeds: [embed] });
    }

    // MAA 연동 테스트
    else if (message.content === 'testMaa') {     
      //message.reply("현재 getTask" + getTskReq);
      message.reply("LinkStart를 tesks.push");
      addTask({
        id: userMaaID,
        type: "LinkStart"
      });
      //message.reply("LingStart res json"+getReportStatus);
      message.reply("요청완료")
  }
    else {
      // 기초 대화 기능
      try {
        const response = await axios.post(GPT_API_ENDPOINT, {
          model: 'gpt-3.5-turbo-0125', 
          //model: 'ft:gpt-3.5-turbo-0125:hepari:20240328:97daB1Fy', 
          messages: [
            {"role": "system", "content": AI_PROMPT},
            {"role" : "assistant", "content": botReply},  // 이전 대화 내용을 기억합니다.
            {"role": "user", "content": message.content}
          ]
        }, {
          headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
    
        botReply = response.data.choices[0].message.content;
        await message.reply(botReply);
        console.log(message.content)
        console.log(botReply)
        console.log("---------------------------------------------------------------")
    
      } catch (error) {
        console.error('Error responding to message: ', error);
      }
    }
  }); 

// 봇 실행
client.login(DISCORD_TOKEN);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server and Discord bot are running on http://localhost:${PORT}`);
});

let tasks = []; 
function addTask(newTask) {
    tasks.push(newTask);
}
// 실행할 작업을 가져오는 엔드포인트 (1초마다 폴링)
app.post('/maa/getTask', (req, res) => {
  console.log('server 폴링중입니다', req.body); // 1초마다 폴링
  getTskReq = JSON.stringify(req.body); // 요청을 임시 let에 저장 : 출력 디버깅용
  res.json({ tasks });
});
// 작업 상태 보고 엔드포인트
app.post('/maa/reportStatus', (req, res) => {
  console.log('작업 실행 결과:', req.body);
  getReportStatus = JSON.stringify(req.body); // json 2 string 
  res.send('OK');
});
app.listen(maaPort, () => {
  console.log(`서버가 ${maaPort}번 포트에서 실행중입니다.`);
});

// maa와의 원격 조작 테스트
function testMaa() {
  console.log("LinkStart 요청")
  addTask({
  id: userMaaID,
  type: "LinkStart"
});
console.log("요청완료")
}







// tts 함수
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
