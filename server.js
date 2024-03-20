const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();

// JSON 요청 본문을 파싱하기 위한 미들웨어 설정
app.use(express.json());

const API_KEY = process.env.OPENAI_API_KEY;
const GPT_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

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
        {"role": "system", "content": "You are a helpful assistant. your name is 로즈마리"},
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
