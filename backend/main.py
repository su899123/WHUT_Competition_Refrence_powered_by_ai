from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# 加载 .env 文件（优先级低于系统环境变量）
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env"))

from database import engine, Base
from routers import competitions, ai

# 创建数据库表
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="大学生竞赛信息平台 API",
    description="竞赛信息收集、AI摘要、多维度展示",
    version="1.0.0",
)

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(competitions.router)
app.include_router(ai.router)


@app.get("/")
def root():
    return {"message": "大学生竞赛信息平台 API", "version": "1.0.0"}


@app.on_event("startup")
async def startup_check():
    """启动时检查关键配置"""
    if not os.getenv("DEEPSEEK_API_KEY"):
        print("=" * 60)
        print("⚠️  DEEPSEEK_API_KEY 未配置！AI 功能将不可用。")
        print("   请设置环境变量后重启：")
        print("   Windows PowerShell: $env:DEEPSEEK_API_KEY = \"sk-你的API密钥\"")
        print("   Linux/Mac:          export DEEPSEEK_API_KEY=sk-你的API密钥")
        print("   获取 API Key:       https://platform.deepseek.com/api_keys")
        print("=" * 60)
    else:
        print(f"✅ DeepSeek API Key 已配置 ({os.getenv('DEEPSEEK_API_KEY')[:8]}***)")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
