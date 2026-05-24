"""
竞赛数据导入脚本 — 自动检测最新版本，全量导入 SQLite。

用法：在 backend 目录下运行
    python import_data.py                  # 自动用最新版本
    python import_data.py --version v3     # 指定版本
    python import_data.py --dry-run        # 预览模式（不写入）
"""
import json
import re
import sys
import os
import argparse
import glob
from datetime import date, datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine, Base
from models import Competition

Base.metadata.create_all(bind=engine)

# ============ 配置 ============
STORAGE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "storage")

LEVEL_MAP = {
    "A1": "A1", "A2": "A2", "A3": "A3",
    "B1": "B1", "B2": "B2",
    "国际级": "A1", "国家级": "A2", "省级": "A3", "校级": "B1", "院级": "B2",
}

CATEGORY_KEYWORDS = {
    "理工科": [
        "机械", "电气", "电子", "嵌入式", "芯片", "物理", "化工", "化学", "材料",
        "结构设计", "成图", "信息建模", "BIM", "土木", "建筑", "交通", "物流",
        "机器人", "编程", "计算机", "软件", "网络", "数学", "建模", "自动化",
        "制冷", "空调", "安全科学", "工程", "智能", "智能制造", "光电", "集成电路",
        "铸造", "高分子", "混凝土", "测绘", "汽车", "航行器", "金相", "GIS",
        "能源", "油气", "环境", "生命科学", "统计",
    ],
    "文科": [
        "英语", "演讲", "公共管理", "广告", "数字艺术", "艺术设计",
        "文案", "策划", "平面", "视频", "动画", "广播", "辩论",
        "马克思主义", "汉语", "外语",
    ],
    "商科": [
        "创业", "商业", "营销", "财务", "决策", "管理模拟",
        "沙盘", "经济", "市场调查", "人力资源", "企业竞争",
        "供应链", "品牌策划",
    ],
    "医学": [
        "医学", "临床", "护理", "药学", "生物医学",
    ],
    "艺术": [
        "设计大赛", "艺术大赛", "数字艺术", "NCDA", "UI", "视觉传达",
        "文创", "美术", "音乐", "舞蹈", "好创意", "米兰设计",
    ],
    "综合": [
        "创新创意", "创新创业", "挑战杯", "互联网+",
    ],
}


# ============ 文件发现 ============

def find_latest_file(version: str | None = None) -> str:
    """自动发现最新版本的 competition-v*.txt 文件"""
    pattern = os.path.join(STORAGE_DIR, "competition-v*.txt")
    files = glob.glob(pattern)
    if not files:
        raise FileNotFoundError(
            f"未找到竞赛数据文件，请在 {STORAGE_DIR} 下放置 competition-vXX.txt"
        )

    if version:
        target = os.path.join(STORAGE_DIR, f"competition-{version}.txt")
        if target not in files:
            available = [os.path.basename(f) for f in files]
            raise FileNotFoundError(f"未找到指定版本: {version}，可用: {available}")
        return target

    def extract_version(filepath: str) -> int:
        m = re.search(r"competition-v(\d+)\.txt", filepath)
        return int(m.group(1)) if m else 0

    files.sort(key=extract_version)
    return files[-1]


# ============ 数据推断 ============

def infer_category(title: str, tracks: list | None) -> str:
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


def infer_level(raw_level, title: str) -> str:
    if raw_level and isinstance(raw_level, str) and raw_level.strip() in LEVEL_MAP:
        return LEVEL_MAP[raw_level.strip()]
    for keyword, level in [
        ("国际", "A1"), ("全国", "A2"), ("中国", "A2"), ("国家", "A2"),
        ("省", "A3"), ("华中", "A3"), ("校", "B1"), ("院", "B2"),
    ]:
        if keyword in title:
            return level
    return "B1"


# ============ 字段解析 ============

def parse_date(date_str) -> str | None:
    """解析日期，返回 YYYY-MM-DD 或 None"""
    if not date_str or not isinstance(date_str, str):
        return None
    date_str = date_str.strip()
    if len(date_str) < 8:
        return None
    for fmt in ["%Y-%m-%d", "%Y.%m.%d", "%Y/%m/%d", "%Y年%m月%d日"]:
        try:
            return datetime.strptime(date_str, fmt).strftime("%Y-%m-%d")
        except ValueError:
            continue
    try:
        return date.fromisoformat(date_str).isoformat()
    except (ValueError, TypeError):
        pass
    m = re.match(r"(\d{4})年(\d{1,2})月(\d{1,2})日", date_str)
    if m:
        return f"{m.group(1)}-{int(m.group(2)):02d}-{int(m.group(3)):02d}"
    m = re.match(r"(\d{4})-(\d{1,2})$", date_str)
    if m:
        return f"{m.group(1)}-{int(m.group(2)):02d}-01"
    return None


def format_qq_groups(qq_groups) -> str:
    if not qq_groups or not isinstance(qq_groups, list):
        return ""
    parts = []
    for g in qq_groups:
        if isinstance(g, dict):
            track = g.get("track", "")
            group = g.get("group", "")
            parts.append(f"{track}:{group}" if track else group)
    return "; ".join(parts)


def format_tags(tracks) -> str:
    if not tracks or not isinstance(tracks, list):
        return ""
    return ", ".join(t for t in tracks if t)


# ============ JSON 容错 ============

def fix_json(text: str) -> str:
    """修复数据文件中常见 JSON 格式问题"""
    # level 值缺引号
    text = re.sub(r'"level"\s*:\s*([A-Za-z0-9]+)\s*([,}\n])', r'"level": "\1"\2', text)
    # 字段间缺逗号（换行处的两个字符串字段）
    text = re.sub(r'"\s*\n\s*"', '",\n  "', text)
    return text


# ============ 文件解析 ============

def parse_entries(filepath: str) -> list[dict]:
    """解析 competition-v*.txt，返回竞赛数据列表"""
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # 按条目分割："N.网站：" / "N.网址：" / "N，网站：" 均兼容
    header_pattern = re.compile(r"(\d+)[\.，。]*(?:网站|网址)[：:]\s*(.+)")
    parts = re.split(r"\n(?=\d+[\.，。]*(?:网站|网址)[：:])", content)

    entries = []
    for part in parts:
        part = part.strip()
        if not part:
            continue
        lines = part.split("\n", 1)
        header = lines[0].strip()
        m = header_pattern.match(header)
        if not m:
            continue

        seq = int(m.group(1))
        site_url = m.group(2).strip()
        json_text = lines[1].strip() if len(lines) > 1 else ""
        if not json_text:
            continue

        # 处理 JSON 前有描述文字的情况
        brace_idx = json_text.find("{")
        if brace_idx > 0:
            json_text = json_text[brace_idx:]

        try:
            data = json.loads(json_text)
        except json.JSONDecodeError:
            try:
                data = json.loads(fix_json(json_text))
            except json.JSONDecodeError as e:
                print(f"  ⚠ 第 {seq} 条 JSON 解析失败: {e}")
                continue

        data["_seq"] = seq
        data["_site_url"] = site_url
        entries.append(data)

    return entries


# ============ 主流程 ============

def import_all(filepath: str, dry_run: bool = False):
    db = SessionLocal()
    try:
        if dry_run:
            print(f"[预览模式] 数据文件: {filepath}\n")

        existing = db.query(Competition).count()
        if existing > 0:
            if not dry_run:
                db.query(Competition).delete()
                db.commit()
            print(f"已清空 {existing} 条旧数据")

        entries = parse_entries(filepath)
        print(f"解析到 {len(entries)} 条竞赛记录")

        imported, skipped = 0, 0
        for data in entries:
            try:
                raw_level = data.get("level")
                title = data.get("title", "未知竞赛")
                tracks = data.get("tracks")
                intro = data.get("intro", "")
                deadline = data.get("deadline")
                organizer = data.get("organizer") or ""
                file_url = data.get("file_url") or ""
                site_url = data.get("_site_url", "")

                official_url = file_url if (file_url and file_url.startswith("http")) else site_url
                level = infer_level(raw_level, title)
                category = infer_category(title, tracks)
                registration_end_str = parse_date(str(deadline)) if deadline else None
                contact_info = format_qq_groups(data.get("qq_groups"))
                tags = format_tags(tracks)

                competition = Competition(
                    title=title,
                    level=level,
                    category=category,
                    organizer=str(organizer),
                    description=intro,
                    summary=intro[:150] if intro else "",
                    registration_start=None,
                    registration_end=(
                        date.fromisoformat(registration_end_str)
                        if registration_end_str else None
                    ),
                    competition_date=None,
                    eligibility="",
                    awards="",
                    contact_info=contact_info,
                    official_url=official_url,
                    tags=tags,
                    status="active",
                )
                if not dry_run:
                    db.add(competition)
                imported += 1
            except Exception as e:
                print(f"  ⚠ 第 {data.get('_seq', '?')} 条导入失败: {e}")
                skipped += 1

        if not dry_run:
            db.commit()

        total = existing if dry_run else db.query(Competition).count()
        print(f"\n{'[预览] ' if dry_run else ''}导入完成：成功 {imported} 条, 跳过 {skipped} 条")
        print(f"数据库现有 {total} 条竞赛记录")

    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="导入竞赛数据到数据库")
    parser.add_argument(
        "--version", "-v", type=str, default=None,
        help="指定版本号，如 v3（默认自动用最新版本）",
    )
    parser.add_argument(
        "--dry-run", "-n", action="store_true",
        help="预览模式，只解析不写入数据库",
    )
    args = parser.parse_args()

    filepath = find_latest_file(args.version)
    print(f"数据文件: {filepath}")
    import_all(filepath, dry_run=args.dry_run)
