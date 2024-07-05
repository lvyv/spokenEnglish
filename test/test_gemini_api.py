# main.py

import asyncio
import os
import uuid
import time
from dataclasses import dataclass

from fastapi import APIRouter, Depends, HTTPException, Path, Query, WebSocket, WebSocketDisconnect
from firebase_admin import auth
from firebase_admin.exceptions import FirebaseError
from sqlalchemy.orm import Session

from realtime_ai_character.audio.speech_to_text import get_speech_to_text, SpeechToText
from realtime_ai_character.audio.text_to_speech import get_text_to_speech, TextToSpeech
from realtime_ai_character.character_catalog.catalog_manager import (
    CatalogManager,
    get_catalog_manager,
    Character,  # Add Character import
)
from realtime_ai_character.database.connection import get_db
from realtime_ai_character.llm import get_llm, LLM
from realtime_ai_character.llm.base import AsyncCallbackAudioHandler, AsyncCallbackTextHandler
from realtime_ai_character.logger import get_logger
from realtime_ai_character.models.interaction import Interaction
from realtime_ai_character.utils import (
    ConversationHistory,
    get_connection_manager,
    get_timer,
    Transcript,
)

logger = get_logger(__name__)

router = APIRouter()

manager = get_connection_manager()

timer = get_timer()

GREETING_TXT_MAP = {
    "en-US": "Hi, my friend, what brings you here today?",
    "es-ES": "Hola, mi amigo, ¿qué te trae por aquí hoy?",
    "fr-FR": "Salut mon ami, qu'est-ce qui t'amène ici aujourd'hui?",
    "de-DE": "Hallo mein Freund, was bringt dich heute hierher?",
    "it-IT": "Ciao amico mio, cosa ti porta qui oggi?",
    "pt-PT": "Olá meu amigo, o que te traz aqui hoje?",
    "hi-IN": "नमस्ते मेरे दोस्त, आज आपको यहां क्या लाया है?",
    "pl-PL": "Cześć mój przyjacielu, co cię tu dziś przynosi?",
    "zh-CN": "嗨，我的朋友，今天你为什么来这里？",
    "ja-JP": "こんにちは、私の友達、今日はどうしたの？",
    "ko-KR": "안녕, 내 친구, 오늘 여기 왜 왔어?",
}


async def get_current_user(token: str):
    """Helper function for auth with Firebase."""
    try:
        decoded_token = auth.verify_id_token(token)
    except FirebaseError as e:
        logger.info(f"Received invalid token: {token} with error {e}")
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

    return decoded_token["uid"]


@dataclass
class SessionAuthResult:
    is_existing_session: bool
    is_reconnected: bool
    history: list
    character: Character
    character_id: str


@router.websocket("/ws/{character_id}")
async def websocket_endpoint(
        websocket: WebSocket,
        character_id: str = Path(..., description="The ID of the character to chat with."),
        tts: bool = Query(
            False, description="Whether to use text-to-speech for the character's responses."
        ),
        stt: bool = Query(
            False, description="Whether to use speech-to-text for the user's input."
        ),
        token: str = Query(None, description="The user's authentication token."),
        db: Session = Depends(get_db),
        catalog_manager: CatalogManager = Depends(get_catalog_manager),
):
    character = catalog_manager.get_character(character_id)
    if not character:
        await websocket.close()
        raise HTTPException(status_code=404, detail="Character not found")

    # Initialize conversation history
    history = ConversationHistory()

    # Greet the user
    greeting_text = GREETING_TXT_MAP.get(character.language, GREETING_TXT_MAP["en-US"])
    await websocket.send_text(greeting_text)

    # Initialize the TTS and STT handlers
    tts_handler = get_text_to_speech(character.language) if tts else None
    stt_handler = get_speech_to_text(character.language) if stt else None

    # Main loop for the websocket connection
    try:
        while True:
            # Receive text or audio from the websocket
            data = await websocket.receive_text()
            user_id = str(uuid.uuid4())  # Generate a unique user_id for this session

            if stt_handler:
                user_input = stt_handler.transcribe(data)
            else:
                user_input = data

            # Build the history for the LLM
            history.add_user_message(user_input)

            # Choose the LLM model based on the environment variable
            llm_model = get_llm()
            text_callback = AsyncCallbackTextHandler()
            audio_callback = AsyncCallbackAudioHandler() if tts_handler else None

            # Get the LLM's response
            response_text = await llm_model.achat(
                history=history,
                user_input=user_input,
                user_id=user_id,
                character=character,
                callback=text_callback,
                audioCallback=audio_callback,
            )

            # Update the history with the LLM's response
            history.add_assistant_message(response_text)

            # Send the response back to the websocket
            await websocket.send_text(response_text)

            if tts_handler:
                audio_data = tts_handler.synthesize(response_text)
                await websocket.send_bytes(audio_data)

    except WebSocketDisconnect:
        logger.info(f"WebSocket connection closed for character: {character_id}")
    except Exception as e:
        logger.error(f"An error occurred: {e}")
        await websocket.close()


# Add a simple test case using pytest
import pytest
from starlette.testclient import TestClient


@pytest.mark.asyncio
async def test_websocket_endpoint():
    from main import router
    from realtime_ai_character.character_catalog.catalog_manager import CatalogManager
    from realtime_ai_character.utils import ConversationHistory

    # Example character_id and token for testing (replace with actual values if needed)
    character_id = "example_character_id"
    token = "example_token"

    # Mock CatalogManager and ConversationHistory for testing
    class MockCatalogManager:
        def get_character(self, character_id):
            return Character(id=character_id, language="en-US")  # Replace with actual character details

    class MockConversationHistory(ConversationHistory):
        pass  # You can extend ConversationHistory if needed for testing

    # Test websocket connection
    with TestClient(router) as client:
        with client.websocket_connect(f"/ws/{character_id}?token={token}") as websocket:
            greeting = await websocket.receive_text()
            assert "Hi, my friend, what brings you here today?" in greeting

            # Send and receive messages (mock data for demonstration)
            await websocket.send_text("Hello")
            response = await websocket.receive_text()
            assert response == "Response from LLM"

            # Additional test cases as needed


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(router, host="0.0.0.0", port=8000, log_level="info")
