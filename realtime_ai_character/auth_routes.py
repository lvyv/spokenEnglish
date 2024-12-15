from fastapi import FastAPI, APIRouter, Request, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from realtime_ai_character.database.connection import get_db
from realtime_ai_character.models.user import User
import httpx
import os
import json

app = FastAPI()


router = APIRouter()

GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
GITHUB_OAUTH_URL = "https://github.com/login/oauth/access_token"
GITHUB_API_URL = "https://api.github.com/user"

@router.post("/auth/github")
async def github_login(request: Request, db: Session = Depends(get_db)):
    data = await request.json()  # 解析 JSON 请求体
    code = data.get("code")  # 获取前端发送的 code
    print(f"Received code: {code}")  # 打印收到的 code
    if not code:
        raise HTTPException(status_code=400, detail="No code provided")

    # Exchange code for access token
    async with httpx.AsyncClient() as client:
        response = await client.post(
            GITHUB_OAUTH_URL,
            data={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": code
            },
            headers={"Accept": "application/json"}
        )
        print(response.status_code, response.json())  # 输出调试信息
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch access token")
        access_token = response.json().get("access_token")

    # 获取github用户信息
    async with httpx.AsyncClient() as client:
        user_response = await client.get(
            GITHUB_API_URL,
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if user_response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch user info")
        github_user = user_response.json()

    github_id = github_user.get("id")
    github_name = github_user.get("login")
    github_email = github_user.get("email")

    # 检查用户是否存在
    existing_user = User.get_by_github_id(db, github_id=github_id)
    if existing_user:
        return {"message": "User logged in", "user_id": existing_user.id}

    # Create new user
    new_user = User(
        name=github_name,
        email=github_email,
        github_id=github_id,
    )
    new_user.save(db)
    return {"message": "User created and logged in", "user_id": new_user.id}

# Include the router in your FastAPI app
app = FastAPI()
app.include_router(router, prefix="/api")
