import os
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.schema import BaseMessage, HumanMessage
from realtime_ai_character.database.chroma import get_chroma
from realtime_ai_character.llm.base import (
    AsyncCallbackAudioHandler,
    AsyncCallbackTextHandler,
    LLM,
)
from realtime_ai_character.logger import get_logger
from realtime_ai_character.utils import Character, timed
from typing import Optional
import google.generativeai as genai
import asyncio

proxy_server = '127.0.0.1'
proxy_port = '7890'  # 更新端口号
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
        self.config = {}
        self.db = get_chroma()

    def get_config(self):
        return self.config

    async def async_generate_content(self, user_input):
        loop = asyncio.get_running_loop()
        response = await loop.run_in_executor(None, self.model.generate_content, user_input)
        return response


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

        all_text = ""
        for message in history:
            all_text += message.content + "\n"

        context = self._generate_context(user_input, character)

        # 2. Add user input to history
        history.append(
            HumanMessage(
                content=character.llm_user_prompt.format(context=context, query=user_input)
            )
        )

        callbacks = [callback, StreamingStdOutCallbackHandler()]
        if audioCallback is not None:
            callbacks.append(audioCallback)

        # 调用正确的方法来生成内容
        try:
            response = await self.async_generate_content(all_text)
        except Exception as e:
            print(f"生成内容时出错: {e}")

        logger.info(f"Response: {response}")

        await callback.on_new_token(response.text)
        # await callback.on_llm_end(response.text)
        if audioCallback:
            await audioCallback.on_llm_new_token(response.text)

        return response.text

    def _generate_context(self, query, character: Character) -> str:
        docs = self.db.similarity_search(query)
        docs = [d for d in docs if d.metadata["character_name"] == character.name]
        logger.info(f"Found {len(docs)} documents")
        context = "\n".join([d.page_content for d in docs])
        return context

