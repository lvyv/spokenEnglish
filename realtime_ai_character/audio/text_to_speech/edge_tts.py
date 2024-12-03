import os
import torch
import asyncio
import time
from io import BytesIO
from openvoice import se_extractor
from openvoice.api import BaseSpeakerTTS, ToneColorConverter
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
        self.ckpt_converter = os.path.join(current_dir, '..', 'OpenVoice', 'checkpoints', 'converter')

        # 转换为绝对路径
        self.ckpt_base = os.path.abspath(self.ckpt_base)
        self.ckpt_converter = os.path.abspath(self.ckpt_converter)

        # 设置设备
        self.device = "cuda:0" if torch.cuda.is_available() else "cpu"

        # 初始化模型
        self.base_speaker_tts = BaseSpeakerTTS(f'{self.ckpt_base}/config.json', device=self.device)
        self.base_speaker_tts.load_ckpt(f'{self.ckpt_base}/checkpoint.pth')

        self.tone_color_converter = ToneColorConverter(f'{self.ckpt_converter}/config.json', device=self.device)
        self.tone_color_converter.load_ckpt(f'{self.ckpt_converter}/checkpoint.pth')

        # 加载默认语音特征
        self.source_se = torch.load(f'{self.ckpt_base}/en_default_se.pth').to(self.device)

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

        # # 检测是否遇到 '???' 作为结束标志
        # if '???' in text:
        await self.process_audio_stream(websocket, voice_id, language)

    async def process_audio_stream(self, websocket: WebSocket, voice_id: str, language: str) -> None:
        # 一旦检测到句子结束标识 "???", 合并所有缓存中的句子
        full_text = " ".join(self.text_cache)
        logger.info(f"Generating audio for full text: {full_text}")

        # Step 1: 运行 BaseSpeakerTTS，生成基础语音
        audio_language = {'en-US': 'English', '': 'English'}
        audio_char = {'rebyte': 'default', '': 'default'}
        tmp_audio_path = os.path.join("outputs", f"{time.time()}.wav")

        # 临时保存基础语音为 WAV 文件
        self.base_speaker_tts.tts(
            full_text,
            tmp_audio_path,
            speaker=audio_char[voice_id],  # 使用指定音色
            language=audio_language[language],
            speed=1.0  # 正常语速
        )

        # Step 2: 使用 ToneColorConverter 转换音色
        output_audio_path = os.path.join("outputs", f"{time.time()}_output.wav")
        self.tone_color_converter.convert(
            audio_src_path=tmp_audio_path,  # 输入基础语音文件路径
            src_se=self.source_se,  # 源音色特征
            tgt_se=self.source_se,  # 使用默认目标音色
            output_path=output_audio_path,  # 输出到临时文件
            message="@EdgeTTS"  # 自定义嵌入信息
        )

        # Step 3: 使用 pydub 读取处理后的音频
        audio_segment = AudioSegment.from_wav(output_audio_path)

        # 将处理后的音频导出为字节流
        final_audio_path = os.path.join("outputs", f"{time.time()}_final_output.wav")
        audio_segment.export(final_audio_path, format="wav")

        # 清理临时文件
        os.remove(tmp_audio_path)
        os.remove(output_audio_path)

        # 读取最终输出文件并返回字节数据
        with open(final_audio_path, "rb") as f:
            final_audio_data = f.read()

            # 删除最终输出文件
        os.remove(final_audio_path)
        # 发送生成的音频流到 websocket
        await websocket.send_bytes(final_audio_data)


        # 清空缓存
        self.text_cache.clear()
