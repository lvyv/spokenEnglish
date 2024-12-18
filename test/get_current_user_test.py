# main.py
from fastapi import FastAPI, Depends, HTTPException
from realtime_ai_character.restful_routes import get_current_user

app = FastAPI()

@app.get("/protected")
async def protected_route(current_user: dict = Depends(get_current_user)):
    """受保护的路由，返回当前用户的信息"""
