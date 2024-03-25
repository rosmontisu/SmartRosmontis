const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GPT_API_ENDPOINT = 'https://api.openai.com/v1/audio';



// 변환할 텍스트
const text = "Hello, this is a test for converting text to speech.";
textToSpeech(text);
