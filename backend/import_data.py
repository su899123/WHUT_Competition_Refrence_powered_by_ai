"""
数据导入脚本：将 storage/ 中的竞赛收集文件导入 SQLite 数据库。

用法：在 backend 目录下运行
    python import_data.py
"""
import json
import re
import sys
import os
from datetime import date

# 确保 backend 目录在 path 中
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine, Base
from models import Competition

Base.metadata.create_all(bind=engine)

STORAGE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "storage")
FILES = ["竞赛收集1.txt", "竞赛收集2.txt"]

# ============ 级别推断规则 ============
LEVEL_KEYWORDS = {
    "A1": ["国际", "全球", "世界", "international"],
    "A2": ["全国", "中国", "国家", "中华"],
    "A3": ["省赛", "省级", "华中", "华北", "华东", "华南", "东北", "西北", "西南"],
    "B1": ["校内", "校赛", "校园"],
    "B2": ["学院", "系内"],
}


def infer_level(title: str) -> str:
    """根据标题关键词推断竞赛级别"""
    for level, keywords in LEVEL_KEYWORDS.items():
        for kw in keywords:
            if kw in title:
                return level
    return "B1"


# ============ 类别推断规则 ============
CATEGORY_KEYWORDS = {
    "理工科": [
        "机械", "电气", "电子", "嵌入式", "芯片", "物理", "化工", "化学", "材料",
        "结构设计", "成图", "信息建模", "BIM", "土木", "建筑", "交通", "物流",
        "机器人", "编程", "计算机", "软件", "网络", "数学", "建模", "自动化",
        "制冷", "空调", "安全科学", "工程", "智能",
    ],
    "文科": [
        "英语", "演讲", "公共管理", "广告", "数字艺术", "艺术设计",
        "文案", "策划", "平面", "视频", "动画", "广播",
    ],
    "商科": [
        "创业", "商业", "营销", "财务", "决策", "管理模拟",
        "沙盘", "经济",
    ],
    "医学": [
        "医学", "临床", "护理", "药学", "生物医学",
    ],
    "艺术": [
        "设计大赛", "艺术大赛", "数字艺术", "NCDA", "UI", "视觉传达",
        "文创", "美术", "音乐", "舞蹈",
    ],
    "综合": [
        "创新创意", "创新创业", "挑战杯", "互联网+",
    ],
}


def infer_category(title: str, tracks: list | None) -> str:
    """根据标题和赛道推断学科类别"""
    text = title
    if tracks:
        text += " " + " ".join(tracks)

    scores = {}
    for cat, keywords in CATEGORY_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in text)
        if score > 0:
            scores[cat] = score

    if scores:
        return max(scores, key=scores.get)
    return "综合"


def parse_entry(lines: list[str], start_idx: int) -> tuple[dict | None, int]:
    """
    解析单条竞赛记录，返回 (数据字典, 下一索引)

    格式：
        22.网站：https://...
        { JSON }
    """
    i = start_idx

    # 跳过空行
    while i < len(lines) and not lines[i].strip():
        i += 1
    if i >= len(lines):
        return None, i

    first_line = lines[i].strip()
    # 解析序号和URL
    match = re.match(r"(\d+)\.网站[：:]\s*(.+)", first_line)
    if not match:
        print(f"  警告：第{i+1}行无法解析URL头部: {first_line[:80]}")
        return None, i + 1

    seq = int(match.group(1))
    site_url = match.group(2).strip()
    i += 1

    # 收集 JSON 文本
    json_lines = []
    brace_depth = 0
    started = False
    while i < len(lines):
        line = lines[i]
        for ch in line:
            if ch == "{":
                brace_depth += 1
                started = True
            elif ch == "}":
                brace_depth -= 1
        json_lines.append(line)
        i += 1
        if started and brace_depth == 0:
            break

    try:
        raw_json = "".join(json_lines)
        data = json.loads(raw_json)
    except json.JSONDecodeError as e:
        print(f"  警告：#{seq} JSON解析失败: {e}")
        print(f"  内容: {raw_json[:200]}")
        return None, i

    data["_seq"] = seq
    data["_site_url"] = site_url
    return data, i


def map_to_competition(data: dict) -> dict:
    """将原始 JSON 字段映射到 Competition 模型字段"""
    title = data.get("title", "")
    organizer = data.get("organizer") or ""
    intro = data.get("intro") or ""
    deadline = data.get("deadline")
    tracks = data.get("tracks")
    qq_groups = data.get("qq_groups")
    file_url = data.get("file_url")
    site_url = data.get("_site_url", "")

    # 推断级别和类别
    raw_level = data.get("level") or ""
    # 归一化 level 值（如 "A类"/"国家级A类" → "A2"）
    if "国际" in raw_level:
        level = "A1"
    elif "国家" in raw_level:
        level = "A2"
    elif "省" in raw_level:
        level = "A3"
    elif raw_level and raw_level != "null":
        level = infer_level(title)
    else:
        level = infer_level(title)
    category = infer_category(title, tracks)

    # tracks → tags（逗号分隔）
    tags_list = []
    if tracks:
        tags_list.extend(tracks)
    if tags_list:
        tags = ",".join(tags_list)
    else:
        tags = ""

    # QQ群 → contact_info
    contact_parts = []
    if qq_groups:
        for g in qq_groups:
            track_name = g.get("track", "")
            group_num = g.get("group", "")
            if group_num:
                label = f"{track_name}:{group_num}" if track_name else group_num
                contact_parts.append(label)
    contact_info = "; ".join(contact_parts) if contact_parts else ""

    # official_url：优先 file_url 中的 URL，否则用 site_url
    official_url = ""
    if file_url and file_url.startswith("http"):
        official_url = file_url
    elif site_url:
        official_url = site_url

    # 解析截止日期
    registration_end = None
    if deadline:
        try:
            registration_end = date.fromisoformat(deadline)
        except (ValueError, TypeError):
            pass

    # 生成简短摘要（intro 的前150字）
    summary = intro[:150] if intro else ""

    # 所有导入数据默认 active（历史竞赛也展示，方便浏览）
    status = "active"

    return {
        "title": title,
        "level": level,
        "category": category,
        "organizer": organizer,
        "description": intro,
        "summary": summary,
        "registration_end": registration_end,
        "registration_start": None,
        "competition_date": None,
        "eligibility": "",
        "awards": "",
        "contact_info": contact_info,
        "official_url": official_url,
        "tags": tags,
        "status": status,
    }


def import_all():
    db = SessionLocal()

    existing_count = db.query(Competition).count()
    if existing_count > 0:
        print(f"数据库已有 {existing_count} 条数据，将清空后重新导入...")
        db.query(Competition).delete()
        db.commit()

    total = 0
    for filename in FILES:
        filepath = os.path.join(STORAGE_DIR, filename)
        if not os.path.exists(filepath):
            print(f"⚠ 文件不存在：{filepath}")
            continue

        print(f"\n📄 正在处理：{filename}")
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        lines = content.split("\n")

        idx = 0
        file_count = 0
        while idx < len(lines):
            data, idx = parse_entry(lines, idx)
            if data is None:
                continue

            try:
                mapped = map_to_competition(data)
                comp = Competition(**mapped)
                db.add(comp)
                db.commit()
                db.refresh(comp)

                file_count += 1
                level_tag = f"[{mapped['level']}]" if mapped['level'] != "校级" else ""
                print(f"  #{data['_seq']} ✓ {level_tag} {mapped['title'][:50]}...")
            except Exception as e:
                db.rollback()
                print(f"  #{data['_seq']} ✗ 导入失败: {e}")

        print(f"  → 本文件成功导入 {file_count} 条")
        total += file_count

    db.close()
    print(f"\n{'='*50}")
    print(f"✅ 全部完成！共导入 {total} 条竞赛数据")
    print(f"{'='*50}")


if __name__ == "__main__":
    import_all()
