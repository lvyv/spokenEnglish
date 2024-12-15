import warnings
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from realtime_ai_character.audio.speech_to_text import get_speech_to_text
from realtime_ai_character.audio.text_to_speech import get_text_to_speech
from realtime_ai_character.character_catalog.catalog_manager import CatalogManager
from realtime_ai_character.restful_routes import router as restful_router
from realtime_ai_character.twilio.websocket import twilio_router
from realtime_ai_character.utils import ConnectionManager
from realtime_ai_character.websocket_routes import router as websocket_router
import os
import sys
from dotenv import load_dotenv

# 导入 auth_routes 中的 router
from realtime_ai_character.auth_routes import router as auth_router

os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"  # 添
load_dotenv()

# 获取项目根目录
project_root = os.path.dirname(os.path.abspath(__file__))

# 添加 OpenVoice 目录到 PYTHONPATH
openvoice_path = os.path.join(project_root, "audio", "OpenVoice")
if openvoice_path not in sys.path:
    sys.path.append(openvoice_path)

# 确保 text_to_speech 包正确导入时有相同的项目路径
text_to_speech_path = os.path.join(project_root, "audio", "text_to_speech")
if text_to_speech_path not in sys.path:
    sys.path.append(text_to_speech_path)

# FastAPI 实例化
app = FastAPI()

# 添加 CORS 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 可以设置为具体的前端地址，避免使用 '*'
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 包含路由
app.include_router(restful_router)      # docs
app.include_router(websocket_router)  # 对话框中，后端可以主动向前端发问
app.include_router(twilio_router)      # Twilio 路由

# 引入登录相关的路由
app.include_router(auth_router, prefix="/api")  # 登录测试

# 初始化组件
CatalogManager.initialize()
ConnectionManager.initialize()
get_text_to_speech()
get_speech_to_text()

# 抑制废弃警告
warnings.filterwarnings("ignore", module="whisper")

# 启动应用
if __name__ == '__main__':
    uvicorn.run('main:app', host='127.0.0.1', port=18080)
