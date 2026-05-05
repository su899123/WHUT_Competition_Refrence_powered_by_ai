from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
