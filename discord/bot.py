# bot.py
import discord
from discord.ext import commands
import os
from dotenv import load_dotenv
from gpt import generate_response

intents = discord.Intents.default()  # 기본 권한 설정
intents.messages = True  # 메시지 읽기 권한 활성화
intents.guilds = True  # 서버 관련 이벤트 권한 활성화
intents.members = True  # 서버 멤버 관련 이벤트 권한 활성화

# 환경 변수 로드
load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')

# 봇 초기화
bot = commands.Bot(command_prefix='!', intents=discord.Intents.all())

@bot.event
async def on_ready():
    print(f'{bot.user} has connected to Discord!')

@bot.event
async def on_message(message):
    if message.author == bot.user:
        return

    # 사용자의 메시지에 GPT로 응답을 생성합니다.
    response = generate_response(message.content)
    await message.channel.send(response)  
    print("인식 : " + message)

# 봇 실행
bot.run(TOKEN)
