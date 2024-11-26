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
from realtime_ai_character.utils import Character  # 测试用
import os#添
os.environ["KMP_DUPLICATE_LIB_OK"]="TRUE"#添
import sys
import os

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




app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    # Change to domains if you deploy this to production
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(restful_router)      # docs
app.include_router(websocket_router)  # 对话框中，后端可以主动向前端发问
app.include_router(twilio_router)   #

# initializations
CatalogManager.initialize()
ConnectionManager.initialize()
get_text_to_speech()
get_speech_to_text()

# suppress deprecation warnings
warnings.filterwarnings("ignore", module="whisper")

if __name__ == '__main__':
    """Test app.main:app"""
    uvicorn.run('main:app',  # noqa 标准用法
            host='127.0.0.1',
            port=18080,
            )
