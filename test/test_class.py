
import asyncio

import edge_tts

TEXT = "大家好，欢迎关注语音之家，语音之家是一个助理AI语音开发者的社区。"
VOICE = "zh-CN-YunyangNeural"
OUTPUT_FILE = "./test1.mp3"


async def amain() -> None:
    """Main function"""
    communicate = edge_tts.Communicate(TEXT, VOICE)
    await communicate.save(OUTPUT_FILE)


if __name__ == "__main__":
    loop = asyncio.get_event_loop_policy().get_event_loop()
    try:
        loop.run_until_complete(amain())
    finally:
        loop.close()