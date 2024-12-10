import os
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
from realtime_ai_character.database.base import Base
# 加载环境变量
# load_dotenv()
#
# # 定义基础类
# Base = declarative_base()

class Scene(Base):
    __tablename__ = "scenes"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    image = Column(String, nullable=False)  # 存储图片的路径或 URL
    category = Column(String, nullable=False)  # 添加类别字段

    def save(self, db):
        db.add(self)
        db.commit()