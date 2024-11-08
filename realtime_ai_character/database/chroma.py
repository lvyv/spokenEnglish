import os
from dotenv import load_dotenv
import google.generativeai as genai
from langchain.vectorstores import Chroma
from realtime_ai_character.logger import get_logger

# 加载环境变量
load_dotenv()
logger = get_logger(__name__)


def __init__(self):
    self.gemini_api_key = os.getenv("GEMINI_API_KEY", "")
    if not self.gemini_api_key:
        raise ValueError("GEMINI_API_KEY is not set")

def get_embedding(text):
    try:
        model = 'models/embedding-001'
        embedding = genai.embed_content(model=model,
                                        content=text,
                                        task_type="retrieval_document")
        return embedding['embedding']
    except Exception as e:
        logger.error(f"Error obtaining embedding: {e}")
        return None


class EmbeddingFunction:
    def __init__(self, embed_func):
        self.embed_func = embed_func

    def embed_documents(self, texts):
        embeddings = []
        for text in texts:
            embedding = self.embed_func(text)
            if embedding is not None:
                embeddings.append(embedding)
            else:
                embeddings.append(None)
        return embeddings

    def embed_query(self, query):
        # 将查询文本转换为嵌入
        return self.embed_func(query)


def get_chroma(embedding: bool = True):
    embedding_function = EmbeddingFunction(get_embedding) if embedding else None

    chroma = Chroma(
        collection_name="llm",
        embedding_function=embedding_function,
        persist_directory="./chroma.db",
    )
    return chroma

