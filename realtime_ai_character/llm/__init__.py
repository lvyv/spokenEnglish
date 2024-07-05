import os
from functools import cache

from dotenv import load_dotenv
from langchain.chat_models.base import BaseChatModel

from realtime_ai_character.llm.base import LLM

load_dotenv()

# 根据指定的模型名称获取对应的语言模型对象
def get_llm(model="gemini-1.5-flash") -> LLM:  # try原来为默认模型
    model = os.getenv("LLM_MODEL_USE", model)

    if model.startswith("gpt"):
        from realtime_ai_character.llm.openai_llm import OpenaiLlm

        return OpenaiLlm(model=model)
    elif model.startswith("claude"):
        from realtime_ai_character.llm.anthropic_llm import AnthropicLlm

        return AnthropicLlm(model=model)
    elif "localhost" in model:
        # Currently use llama2-wrapper to run local llama models
        local_llm_url = os.getenv("LOCAL_LLM_URL", "")
        if local_llm_url:
            from realtime_ai_character.llm.local_llm import LocalLlm

            return LocalLlm(url=local_llm_url)
        else:
            raise ValueError("LOCAL_LLM_URL not set")
    elif "llama" in model:
        # Currently use Anyscale to support llama models
        from realtime_ai_character.llm.anyscale_llm import AnysacleLlm

        return AnysacleLlm(model=model)
    elif "rebyte" in model:
        from realtime_ai_character.llm.rebyte_llm import RebyteLlm

        return RebyteLlm()
    elif "gemini" in model:  # 添加Gemini-Pro模型的条件
        from realtime_ai_character.llm.gemini_llm import GeminiLlm
        return GeminiLlm()
    else:
        raise ValueError(f"Invalid llm model: {model}")


# 根据输入的模型名称选择并返回相应的聊天模型对象
def get_chat_model(model="gemini-1.5-flash") -> BaseChatModel:
    model = os.getenv("LLM_MODEL_USE", model)

    if model.startswith("gpt"):
        from realtime_ai_character.llm.openai_llm import OpenaiLlm

        return OpenaiLlm(model=model).chat_open_ai
    elif model.startswith("claude"):
        from realtime_ai_character.llm.anthropic_llm import AnthropicLlm

        return AnthropicLlm(model=model).chat_anthropic
    elif "localhost" in model:
        # Currently use llama2-wrapper to run local llama models
        local_llm_url = os.getenv("LOCAL_LLM_URL", "")
        if local_llm_url:
            from realtime_ai_character.llm.local_llm import LocalLlm

            return LocalLlm(url=local_llm_url).chat_open_ai
        else:
            raise ValueError("LOCAL_LLM_URL not set")
    elif "llama" in model:
        # Currently use Anyscale to support llama models
        from realtime_ai_character.llm.anyscale_llm import AnysacleLlm

        return AnysacleLlm(model=model).chat_open_ai
    elif "rebyte" in model:
        from realtime_ai_character.llm.rebyte_llm import RebyteLlm

        return RebyteLlm().chat_rebyte
    elif "gemini" in model:
        from realtime_ai_character.llm.gemini_llm import GeminiLlm

        return GeminiLlm().chat_gemini
    else:
        raise ValueError(f"Invalid llm model: {model}")


# 从环境变量中获取相应的 API 密钥，并根据 API 密钥选择并返回相应的聊天模型对象
@cache
def get_chat_model_from_env() -> BaseChatModel:
    """GPT-4 has the best performance while generating system prompt."""

    if os.getenv("REBYTE_API_KEY"):
        return get_chat_model(model="rebyte")
    elif os.getenv("OPENAI_API_KEY"):
        return get_chat_model(model="gpt-4")
    elif os.getenv("ANTHROPIC_API_KEY"):
        return get_chat_model(model="claude-2")
    elif os.getenv("ANYSCALE_API_KEY"):
        return get_chat_model(model="meta-llama/Llama-2-70b-chat-hf")
    elif os.getenv("LOCAL_LLM_URL"):
        return get_chat_model(model="localhost")
    elif os.getenv("GEMINI_API_KEY"):  # 添加Gemini API密钥检查条件
        return get_chat_model(model="gemini")  # 返回Gemini模型对象

    raise ValueError("No llm api key found in env")
