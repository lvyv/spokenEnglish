import os
import torch
import asyncio
import time

from collections import defaultdict
from openvoice.api import BaseSpeakerTTS
from realtime_ai_character.audio.text_to_speech.base import TextToSpeech
from realtime_ai_character.logger import get_logger
from realtime_ai_character.utils import Singleton, timed
from fastapi.websockets import WebSocket
from pydub import AudioSegment

logger = get_logger(__name__)

DEFAULT_VOICE_ID = "default"
DEFAULT_LANGUAGE = "English"


class EdgeTTS(Singleton, TextToSpeech):
    def __init__(self):
        super().__init__()
        logger.info("Initializing [LocalTTS] model...")

        # 获取当前脚本所在目录
        current_dir = os.path.dirname(os.path.abspath(__file__))

        # 定义 checkpoints 的基路径
        self.ckpt_base = os.path.join(current_dir, '..', 'OpenVoice', 'checkpoints', 'base_speakers', 'EN')

        # 转换为绝对路径
        self.ckpt_base = os.path.abspath(self.ckpt_base)

        # 设置设备
        self.device = "cuda:0" if torch.cuda.is_available() else "cpu"

        # 初始化模型（确保只加载一次）
        self.base_speaker_tts = BaseSpeakerTTS(f'{self.ckpt_base}/config.json', device=self.device)
        self.base_speaker_tts.load_ckpt(f'{self.ckpt_base}/checkpoint.pth')

        logger.info("[LocalTTS] model initialized.")

        # 存储接收到的文本句子
        self.text_cache = []

    @timed
    async def stream(
        self,
        text: str,
        websocket: WebSocket,
        tts_event: asyncio.Event,
        voice_id: str = "default",
        first_sentence: bool = False,
        language: str = "",
        sid: str = "",
        *args,
        **kwargs
    ) -> None:
        # 将每句文本添加到缓存队列中
        logger.info(f"Received text: {text}")
        self.text_cache.append(text)

        # 处理音频并流式发送
        await self.process_audio_stream(websocket, voice_id, language)

    async def process_audio_stream(self, websocket: WebSocket, voice_id: str, language: str) -> None:
        full_text = " ".join(self.text_cache)
        logger.info(f"Generating audio for full text: {full_text}")

        # Step 1: 运行 BaseSpeakerTTS，生成基础语音
        audio_language = {'en-US': 'English', '': 'English'}
        # audio_char = {'rebyte': 'default', '': 'default'}
        audio_char = defaultdict(lambda: 'default', {'rebyte': 'default'})
        tmp_audio_path = os.path.join("outputs", f"{time.time()}.wav")

        # 临时保存基础语音为 WAV 文件
        self.base_speaker_tts.tts(
            full_text,
            tmp_audio_path,
            speaker=audio_char[voice_id],  # 使用指定音色
            language=audio_language[language],
            speed=1.0  # 正常语速
        )

        # Step 2: 删除音色转换部分

        # Step 3: 使用 pydub 读取基础音频并发送
        audio_segment = AudioSegment.from_wav(tmp_audio_path)

        # 将处理后的音频导出为字节流
        final_audio_path = os.path.join("outputs", f"{time.time()}_final_output.wav")
        audio_segment.export(final_audio_path, format="wav")

        # 清理临时文件
        os.remove(tmp_audio_path)

        # 读取最终输出文件并返回字节数据
        with open(final_audio_path, "rb") as f:
            final_audio_data = f.read()

        # 删除最终输出文件
        os.remove(final_audio_path)

        # 发送生成的音频流到 websocket
        await websocket.send_bytes(final_audio_data)

        # 清空缓存
        self.text_cache.clear()

