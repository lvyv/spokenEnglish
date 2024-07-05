import pytest
from unittest.mock import patch, MagicMock
from realtime_ai_character.llm.gemini_llm import GeminiLlm  # 假设这是您的GeminiLlm类

@pytest.fixture
def gemini_llm_instance():
    return GeminiLlm()

def test_generate_response(gemini_llm_instance):
    # 模拟用户输入
    user_input = "How can I improve my spoken English?"

    # 模拟 Gemini chat 对象和其 send_message 方法的行为
    gemini_llm_instance.chat = MagicMock()
    gemini_llm_instance.chat.send_message.return_value.text = "Practice regularly and speak with native speakers."

    # 调用 generate_response 方法
    response = gemini_llm_instance.generate_response(user_input)

    # 断言验证
    assert isinstance(response, str)  # 确保返回的是字符串类型
    assert response == "Practice regularly and speak with native speakers."

if __name__ == "__main__":
    pytest.main()

