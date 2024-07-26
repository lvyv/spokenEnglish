import sys
import os
import asyncio
import websockets

# 将项目根目录加入到 PYTHONPATH
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from realtime_ai_character.audio.text_to_speech.edge_tts import EdgeTTS


async def test_tts():
    async def websocket_handler(websocket, path):
        async for message in websocket:
            print("Received message of length:", len(message))
            with open("output_audio.mp3", "wb") as audio_file:
                audio_file.write(message)
            print("Audio data saved to output_audio.mp3")

    server = await websockets.serve(websocket_handler, "localhost", 8765)
    print("WebSocket server started at ws://localhost:8765")

    edge_tts = EdgeTTS()
    tts_event = asyncio.Event()

    async with websockets.connect("ws://localhost:8765") as websocket:
        text = "Hello, this is a test for text-to-speech conversion."
        await edge_tts.stream(text, websocket, tts_event, voice_id="en-US-ChristopherNeural")

    server.close()
    await server.wait_closed()


asyncio.run(test_tts())
