import os
import httpx
from schemas import AISummaryRequest, AISummaryOut

# DeepSeek API 配置 - 通过环境变量设置
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "your-deepseek-api-key")
DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions"

SYSTEM_PROMPT = """你是一个专业的大学生竞赛信息整理助手。请从以下竞赛通知文本中提取关键信息，并生成一段简洁的摘要（150字以内）。

请以JSON格式返回，包含以下字段（未知的填空字符串）：
{
  "summary": "150字以内的摘要",
  "title": "竞赛名称",
  "level": "国际级/国家级/省级/校级/其他",
  "category": "理工科/文科/商科/医学/艺术/综合/其他",
  "organizer": "主办单位",
  "registration_start": "报名开始日期 YYYY-MM-DD",
  "registration_end": "报名截止日期 YYYY-MM-DD",
  "competition_date": "比赛日期 YYYY-MM-DD",
  "eligibility": "参赛资格要求",
  "awards": "奖项设置",
  "contact_info": "联系方式",
  "tags": "关键词标签，逗号分隔"
}

只返回JSON，不要有其他内容。"""


async def extract_competition_info(description: str) -> AISummaryOut:
    """调用 DeepSeek API 进行竞赛信息结构化提取"""
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            DEEPSEEK_API_URL,
            headers={
                "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "deepseek-chat",
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"请分析以下竞赛通知：\n\n{description}"},
                ],
                "temperature": 0.3,
                "max_tokens": 1000,
            },
        )
        data = response.json()
        content = data["choices"][0]["message"]["content"]

        # 清理可能的 markdown 代码块标记
        content = content.strip()
        if content.startswith("```"):
            content = content.split("\n", 1)[-1]
            if content.endswith("```"):
                content = content[:-3].strip()

        import json
        result = json.loads(content)
        return AISummaryOut(**result)
