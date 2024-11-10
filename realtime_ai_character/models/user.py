from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.sql import func
from realtime_ai_character.database.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=True)  # 用户名（可选）
    email = Column(String, unique=True, index=True, nullable=True)  # 邮箱（可选）
    phone = Column(String, unique=True, index=True, nullable=False)  # 必须绑定手机号
    github_id = Column(String, unique=True, nullable=True)  # GitHub ID（可选）
    qq_id = Column(String, unique=True, nullable=True)  # QQ ID（可选）
    wechat_id = Column(String, unique=True, nullable=True)  # 微信 ID（可选）
    password_hash = Column(String, nullable=True)  # 邮箱登录的密码（经过哈希处理）

    created_at = Column(DateTime, default=func.now())  # 创建时间
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())  # 更新时间

    is_active = Column(Boolean, default=True)  # 用户是否激活（例如通过邮件验证）
    is_phone_verified = Column(Boolean, default=False)  # 是否绑定手机号

    def save(self, db):
        db.add(self)
        db.commit()
        db.refresh(self)  # 刷新对象以获取最新的数据库字段
        return self

    @classmethod
    def get_by_phone(cls, db, phone):
        return db.query(cls).filter(cls.phone == phone).first()

    @classmethod
    def get_by_email(cls, db, email):
        return db.query(cls).filter(cls.email == email).first()

    @classmethod
    def get_by_github_id(cls, db, github_id):
        return db.query(cls).filter(cls.github_id == github_id).first()

    def is_verified(self):
        # 判断是否已完成手机号绑定
        return self.is_phone_verified
