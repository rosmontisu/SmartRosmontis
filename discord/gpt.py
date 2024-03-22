# gpt.py
import openai
import os
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

openai.api_key = OPENAI_API_KEY

def generate_response(message):
    try:
        response = openai.Completion.create(
          engine="text-davinci-003",
          prompt=message,
          temperature=0.7,
          max_tokens=150,
          top_p=1.0,
          frequency_penalty=0.0,
          presence_penalty=0.0
        )
        return response.choices[0].text.strip()
    except Exception as e:
        print(f"An error occurred: {e}")
        return "죄송해요, 답변을 생성하는 데 문제가 생겼어요."
