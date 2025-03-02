
from fastapi import HTTPException
import sqlite3
import os
from pydantic import BaseModel
LOCAL_DB_PATH =  "D:/new/realtime_ai_character/stardict.db"  # 本地数据库文件路径
# 获取当前脚本所在目录的路径
current_dir = os.path.dirname(os.path.abspath(__file__))
class WordInfo(BaseModel):
    id: int
    word: str
    sw: str
    phonetic: str
    definition: str
    translation: str
    pos: str
    collins: int
    oxford: int
    tag: str
    bnc: int
    frq: int
    exchange: str
def get_word_info(word: str) -> WordInfo:
    """
    查询 SQLite 数据库并返回指定单词的信息。
    """
    # 检查数据库文件是否存在
    if not os.path.exists(LOCAL_DB_PATH):
        raise HTTPException(
            status_code=500,
            detail="数据库文件未找到，请确保 stardict.db 已下载并放置到项目目录下。",
        )

    # 连接 SQLite 数据库
    conn = sqlite3.connect(LOCAL_DB_PATH)
    cursor = conn.cursor()

    # 查询单词信息
    query = """
    SELECT id, word, sw, phonetic, definition, translation, pos, collins, oxford, tag, bnc, frq, exchange
    FROM stardict
    WHERE word = ?
    LIMIT 1
    """
    cursor.execute(query, (word,))
    result = cursor.fetchone()
    conn.close()

    # 检查查询结果
    if not result:
        raise HTTPException(status_code=404, detail=f"Word '{word}' not found.")

    # 返回单词信息
    return WordInfo(
        id=result[0],
        word=result[1] or "",
        sw=result[2] or "",
        phonetic=result[3] or "",
        definition=result[4] or "",
        translation=result[5] or "",
        pos=result[6] or "",
        collins=result[7] or 0,
        oxford=result[8] or 0,
        tag=result[9] or "",
        bnc=result[10] or 0,
        frq=result[11] or 0,
        exchange=result[12] or "",
    )



