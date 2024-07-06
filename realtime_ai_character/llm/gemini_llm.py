import os
import google.generativeai as genai
from typing import Optional
from realtime_ai_character.llm.base import (
    AsyncCallbackAudioHandler,
    AsyncCallbackTextHandler,
    LLM,
)
from realtime_ai_character.logger import get_logger
from realtime_ai_character.utils import Character, timed
from langchain.schema import BaseMessage, HumanMessage
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

logger = get_logger(__name__)


class GeminiLlm(LLM):
    def __init__(self):
        self.gemini_api_key = os.getenv("GEMINI_API_KEY", "")
        genai.configure(api_key=self.gemini_api_key)
        model = genai.GenerativeModel('gemini-pro-latest')
        self.chat_gemini = model.start_chat(history=[])
        self.config = {}

    def get_config(self):
        return self.config

    def _set_character_config(self, character: Character):
        pass

    def _set_user_config(self, user_id: str):
        pass

    @timed
    async def achat(
        self,
        history: list[BaseMessage],
        user_input: str,
        user_id: str,
        character: Character,
        callback: AsyncCallbackTextHandler,
        audioCallback: Optional[AsyncCallbackAudioHandler] = None,
        metadata: Optional[dict] = None,
        *args,
        **kwargs,
    ) -> str:
        # 1. Add user input to history
        # delete the first system message in history. just use the system prompt in rebyte platform
        history.pop(0)

        history.append(HumanMessage(content=user_input))
        # 2. Generate response
        # set project_id and agent_id for character
        self._set_character_config(character=character)
        # set session_id for user
        self._set_user_config(user_id)

        callbacks = [callback, StreamingStdOutCallbackHandler()]
        if audioCallback is not None:
            callbacks.append(audioCallback)
        response = await self.chat_gemini.send_message("In one sentence, explain how a computer works to a young child.")
        logger.info(f"Response: {response}")
        return response.generations[0][0].text
