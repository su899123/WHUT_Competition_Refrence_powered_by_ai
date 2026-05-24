import os
import json
import httpx
from schemas import AISummaryOut

DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions"


def _get_api_key() -> str:
    """每次调用时读取环境变量，避免模块级缓存"""
    key = os.getenv("DEEPSEEK_API_KEY", "")
    if not key:
        raise ValueError("DEEPSEEK_API_KEY 未设置，请通过环境变量配置")
    return key

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
    api_key = _get_api_key()

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            DEEPSEEK_API_URL,
            headers={
                "Authorization": f"Bearer {api_key}",
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
        response.raise_for_status()
        data = response.json()

        # 安全访问 choices → message → content
        choices = data.get("choices") or []
        if not choices:
            raise ValueError("AI 响应缺少 choices 字段")
        msg = choices[0].get("message")
        if not isinstance(msg, dict) or "content" not in msg:
            raise ValueError("AI 响应缺少 message/content 字段")
        content = msg["content"]

        # 清理可能的 markdown 代码块标记
        content = content.strip()
        if content.startswith("```"):
            content = content.split("\n", 1)[-1]
            if content.endswith("```"):
                content = content[:-3].strip()

        try:
            result = json.loads(content)
        except json.JSONDecodeError as e:
            raise ValueError(f"AI 响应 JSON 解析失败: {e}")
        return AISummaryOut(**result)


async def web_search(query: str, max_results: int = 3) -> str:
    """使用 DuckDuckGo Instant Answer API 进行联网搜索"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                "https://api.duckduckgo.com/",
                params={"q": query, "format": "json", "no_html": 1, "skip_disambig": 1},
            )
            resp.raise_for_status()
            data = resp.json()
            results = []
            # Abstract
            if data.get("Abstract"):
                results.append(f"摘要: {data['Abstract']}")
            # Related topics
            for topic in (data.get("RelatedTopics") or [])[:max_results]:
                if isinstance(topic, dict) and topic.get("Text"):
                    results.append(f"- {topic['Text']}")
            return "\n".join(results) if results else "(未找到相关搜索结果)"
    except Exception:
        return "(搜索服务暂不可用)"


async def chat_about_competition(
    competition_json: str,
    related_competitions: str,
    user_message: str,
    enable_search: bool = False,
) -> str:
    """AI 对话：基于竞赛信息回答用户问题，可选联网搜索"""
    api_key = _get_api_key()

    # 联网搜索
    search_context = ""
    if enable_search:
        search_context = f"\n\n[联网搜索结果]\n{await web_search(user_message)}\n[/联网搜索结果]"

    system_prompt = f"""你是一个专业的大学生竞赛顾问AI。用户是武汉理工大学本科生，请结合该校背景、学科优势和学生特点进行分析。你会根据以下竞赛信息，帮助用户分析竞赛、解答疑问、给出参赛建议。

## 用户背景
武汉理工大学本科生（211高校，工科优势，材料、交通、汽车等学科突出）

## 当前竞赛详情
{competition_json}

## 平台其他竞赛参考
{related_competitions}
{search_context}

## 回答要求
1. 结合武汉理工大学学科优势（材料科学、交通运输、机械工程、船舶海洋等）分析竞赛匹配度
2. 基于提供的数据作答，数据不足时可结合你的知识补充，但需标注"据我所知"
3. 回答要具体、实用，给出可操作的建议
4. 如果用户问的是参赛策略、时间规划等，结合竞赛截止日期给出建议
5. 涉及级别、含金量判断时，参考竞赛级别（A1最高> A2 > A3 > B1 > B2）
6. 回答控制在 300 字以内，简洁有力
7. 如有联网搜索结果，优先使用最新信息"""

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            DEEPSEEK_API_URL,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "deepseek-chat",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_message},
                ],
                "temperature": 0.7,
                "max_tokens": 800,
            },
        )
        response.raise_for_status()
        data = response.json()
        choices = data.get("choices") or []
        if not choices:
            raise ValueError("AI 响应缺少 choices 字段")
        msg = choices[0].get("message")
        if not isinstance(msg, dict) or "content" not in msg:
            raise ValueError("AI 响应缺少 message/content 字段")
        return msg["content"]


async def compare_competitions(
    competitions_json: str,
    dimensions: list[str],
) -> str:
    """AI 对比分析：多维度对比多个竞赛"""
    api_key = _get_api_key()

    dim_text = "、".join(dimensions)
    system_prompt = f"""你是一个专业的大学生竞赛分析顾问。用户是武汉理工大学本科生（211高校，工科优势，材料、交通、汽车等学科突出），请结合该校背景进行分析。请对以下竞赛进行对比分析。

## 竞赛数据
{competitions_json}

## 用户关心的维度
{dim_text}

## 输出格式
先输出一段 **简短结论**（2-3句话，直接给出推荐建议），用 `## 简短结论` 标记。
然后输出 **详细分析**，每个维度一段，用 `## 详细分析` 标记。

## 分析原则
1. 级别含金量：A1 > A2 > A3 > B1 > B2
2. 时间紧迫度：根据报名截止日期判断
3. 难度评估：根据赛道数量、参赛要求判断
4. 适合人群：结合武汉理工大学学科优势，匹配参赛资格要求
5. 综合推荐：结合以上维度给出最终建议，优先推荐与该校优势学科相关的竞赛"""

    async with httpx.AsyncClient(timeout=90.0) as client:
        response = await client.post(
            DEEPSEEK_API_URL,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "deepseek-chat",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": "请进行对比分析"},
                ],
                "temperature": 0.5,
                "max_tokens": 1500,
            },
        )
        response.raise_for_status()
        data = response.json()
        choices = data.get("choices") or []
        if not choices:
            raise ValueError("AI 响应缺少 choices 字段")
        msg = choices[0].get("message")
        if not isinstance(msg, dict) or "content" not in msg:
            raise ValueError("AI 响应缺少 message/content 字段")
        return msg["content"]
