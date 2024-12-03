from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from unicodedata import category

from realtime_ai_character.models.Scene import Scene
from realtime_ai_character.database.connection import get_db
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("DATABASE_URL is not set")

# 创建数据库连接
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()

# 场景数据
scenes_data = {
    "recommend": [
        {"name": "机票预定", "image": "/assets/svgs/flight.png"},
        {"name": "酒店预订", "image": "/assets/svgs/hotel.png"},
        {"name": "餐订点餐", "image": "/assets/svgs/meal.png"},
        {"name": "工作面试", "image": "/assets/svgs/interview.png"},
        {"name": "地铁", "image": "/assets/svgs/subway.png"},
        {"name": "超市购物", "image": "/assets/svgs/shopping.png"}
    ],
    "daily": [
        {"name": "预约医生", "image": "/assets/svgs/doctor.png"},
        {"name": "天气预报", "image": "/assets/svgs/weather.png"},
        {"name": "药店买药", "image": "/assets/svgs/pharmacy.png"},
        {"name": "交通事故", "image": "/assets/svgs/accident.png"},
        {"name": "健康饮食", "image": "/assets/svgs/health.png"},
        {"name": "购物结账", "image": "/assets/svgs/checkout.png"},
        {"name": "银行业务", "image": "/assets/svgs/bank.png"},
        {"name": "修理家电", "image": "/assets/svgs/repair.png"},
        {"name": "邻里交往", "image": "/assets/svgs/neighbor.png"},
        {"name": "社区活动", "image": "/assets/svgs/community.png"}
    ],
    "work": [
        {"name": "每周例会", "image": "/assets/svgs/weekly_meeting.png"},
        {"name": "团建活动", "image": "/assets/svgs/team_building.png"},
        {"name": "工作汇报", "image": "/assets/svgs/report.png"},
        {"name": "会议安排", "image": "/assets/svgs/meeting_arrangement.png"},
        {"name": "放假申请", "image": "/assets/svgs/leave_application.png"},
        {"name": "自我介绍", "image": "/assets/svgs/self_introduction.png"}
    ],
    "travel": [
        {"name": "办理登记", "image": "/assets/svgs/registration.png"},
        {"name": "景点观光", "image": "/assets/svgs/sightseeing.png"},
        {"name": "邀约旅行", "image": "/assets/svgs/travel_invitation.png"},
        {"name": "预定酒店", "image": "/assets/svgs/hotel_reservation.png"},
        {"name": "出行问路", "image": "/assets/svgs/direction.png"},
        {"name": "旅行社", "image": "/assets/svgs/travel_agency.png"}
    ],
    "exam": [
        {"name": "工作面试", "image": "/assets/svgs/admission_interview.png"},
        {"name": "招生面试", "image": "/assets/svgs/academic_interview.png"},
        {"name": "学术面试", "image": "/assets/svgs/ielts_mock.png"}
    ],
    "school": [
        {"name": "学校社团", "image": "/assets/svgs/club.png"},
        {"name": "教材购买", "image": "/assets/svgs/textbook.png"},
        {"name": "校园食堂", "image": "/assets/svgs/cafeteria.png"},
        {"name": "校园兼职", "image": "/assets/svgs/part_time_job.png"},
        {"name": "校园参观", "image": "/assets/svgs/campus_tour.png"}
    ]
}

# 插入数据到数据库
def insert_scenes(session, scenes):
    for category, items in scenes.items():
        for item in items:
            name = item['name']
            image = item['image']
            scene = Scene(name=name, image=image,category=category)
            scene.save(session)

# 插入数据
try:
    insert_scenes(session, scenes_data)
finally:
    # 关闭会话
    session.close()

