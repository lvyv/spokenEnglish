import os
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.schema import BaseMessage, HumanMessage
from realtime_ai_character.llm.base import (
    AsyncCallbackAudioHandler,
    AsyncCallbackTextHandler,
    LLM,
)
from realtime_ai_character.logger import get_logger
from realtime_ai_character.utils import Character, timed
from typing import Optional
import google.generativeai as genai

# 导入 RebyteEndpoint 类
from rebyte_langchain.rebyte_langchain import RebyteEndpoint

# 设置环境变量
proxy_server = '127.0.0.1'
proxy_port = '7890'
#proxy_port = '15732'
os.environ['http_proxy'] = f'http://{proxy_server}:{proxy_port}'
os.environ['https_proxy'] = f'http://{proxy_server}:{proxy_port}'

logger = get_logger(__name__)


class GeminiLlm(LLM):
    def __init__(self):
        self.gemini_api_key = os.getenv("GEMINI_API_KEY", "")
        if not self.gemini_api_key:
            raise ValueError("GEMINI_API_KEY is not set")

        genai.configure(api_key=self.gemini_api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        self.chat = None

        self.config = {}

    def get_config(self):
        return self.config

    def _set_character_config(self, character: Character):
        self.chat_rebyte.project_id = character.rebyte_api_project_id
        self.chat_rebyte.agent_id = character.rebyte_api_agent_id
        if character.rebyte_api_version is not None:
            self.chat_rebyte.version = character.rebyte_api_version
        pass

    def _set_user_config(self, user_id: str):
        pass

    def send_message_to_gemini(self, user_input):
        resp = self.model.generate_content(user_input)
        return resp

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
        callbacks = [callback, StreamingStdOutCallbackHandler()]
        if audioCallback is not None:
            callbacks.append(audioCallback)

        response = self.send_message_to_gemini(user_input)
        logger.info(f"Response: {response}")

        try:
            text_response = response.candidates[0].content.parts[0].text
        except (IndexError, AttributeError):
            text_response = "Response contains no valid text."

        await callback.on_new_token(text_response)

        # 这里使用 text_response 而不是 response.text
        if audioCallback is not None:
            await audioCallback.on_llm_new_token(text_response)

        return text_response
