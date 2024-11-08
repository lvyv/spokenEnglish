import asyncio
import os
from edge_tts import Communicate, VoicesManager
from realtime_ai_character.audio.text_to_speech.base import TextToSpeech
from realtime_ai_character.logger import get_logger
from realtime_ai_character.utils import Singleton, timed

logger = get_logger(__name__)

EDGE_TTS_DEFAULT_VOICE = os.getenv("EDGE_TTS_DEFAULT_VOICE", "en-US-ChristopherNeural")

class EdgeTTS(Singleton, TextToSpeech):
    def __init__(self, default_voice=EDGE_TTS_DEFAULT_VOICE, rate="+20%"):
        super().__init__()
        self.voices = None  # Will hold the VoicesManager instance
        self.default_voice = default_voice
        self.rate = rate

    async def _get_voice(self, voice_id):
        if not self.voices:
            self.voices = await VoicesManager.create()

        try:
            voice = self.voices.find(ShortName=voice_id)[0]
        except IndexError:
            logger.warning(f"Voice with ShortName '{voice_id}' not found. Using default voice.")
            voice = self.voices.find(ShortName=self.default_voice)[0]

        return voice

    @timed
    async def generate_audio(self, text, voice_id="", language="en-US") -> bytes:
        try:
            voice = await self._get_voice(voice_id)
            communicate = Communicate(text, voice["Name"], rate=self.rate)
            messages = []
            async for message in communicate.stream():
                if message["type"] == "audio":
                    messages.extend(message["data"])
            return bytes(messages)
        except Exception as e:
            logger.error(f"Failed to generate TTS audio: {e}")
            return b""

    @timed
    async def stream(
            self,
            text,
            websocket,
            tts_event: asyncio.Event,
            voice_id="",
            first_sentence=False,
            language="en-US",
            *args,
            **kwargs
    ) -> None:
        try:
            voice = await self._get_voice(voice_id)
            communicate = Communicate(text, voice["Name"], rate=self.rate)
            messages = []
            async for message in communicate.stream():
                if message["type"] == "audio":
                    messages.extend(message["data"])
            await websocket.send_bytes(bytes(messages))
        except Exception as e:
            logger.error(f"Failed to stream TTS audio: {e}")
    @timed
    async def stream_and_save(self, text_generator, output_file=None, voice_id="", language="en-US", *args, **kwargs) -> None:
        try:
            output_file = output_file or "output_audio.wav"  # Use default file name if not specified
            output_path = os.path.abspath(output_file)

            voice = await self._get_voice(voice_id)

            async with open(output_path, 'wb') as f:
                for text_chunk in text_generator:
                    communicate = Communicate(text_chunk, voice["Name"], rate=self.rate)
                    async for message in communicate.stream():
                        if message["type"] == "audio":
                            await f.write(bytes(message["data"]))

            logger.info(f"Audio saved to: {output_path}")
        except Exception as e:
            logger.error(f"Failed to stream and save TTS audio: {e}")

# Example usage:
# async def main():
#     tts = EdgeTTS()
#
#     # Dynamic text generation example (replace with your actual dynamic text generation logic):
#     dynamic_text_generator = ["Hello, how are you?", "This is a dynamically generated text.", "Another example text."]
#
#     await tts.stream_and_save(dynamic_text_generator)
#
# if __name__ == "__main__":
#     asyncio.run(main())