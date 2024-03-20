from flask import Flask, request, jsonify, send_from_directory
import os
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='public')

API_KEY = os.getenv('OPENAI_API_KEY')
GPT_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions'

# 정적 파일을 위한 경로 설정
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

# 사용자로부터 챗봇 메시지를 받는 POST 요청 처리
@app.route('/chat', methods=['POST'])
def chat():
    message = request.json.get('message')
    if not message:
        return jsonify({'error': 'Message is required'}), 400

    try:
        headers = {
            'Authorization': f'Bearer {API_KEY}',
            'Content-Type': 'application/json',
        }
        data = {
            'model': 'gpt-3.5-turbo',
            'messages': [
                {"role": "system", "content": "You are a helpful assistant. your name is 로즈마리"},
                {"role": "user", "content": message}
            ]
        }
        response = requests.post(GPT_API_ENDPOINT, json=data, headers=headers)
        response.raise_for_status()

        bot_message = response.json()['choices'][0]['message']['content']
        return jsonify({'reply': bot_message})
    except requests.RequestException as e:
        print(f'Error: {e}')
        return jsonify({'error': 'Failed to fetch response from OpenAI'}), 500

if __name__ == '__main__':
    PORT = os.getenv('PORT', 3000)
    app.run(debug=True, port=PORT)
