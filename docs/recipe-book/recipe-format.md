# 📝 食谱格式

清晰、可复用的写法能让每一道菜都更好做。下面是推荐的结构与编写规范，并附一个示例。

## 标准结构

- 标题：菜名（H1）
- YAML Frontmatter：分类与检索元数据（见下文）
  - 必填：category、tags、nutrition、health
  - 建议：time.prep/cook/total、servings、difficulty、spiciness、flavor
- 简介：一句话说明菜的特色与场景
- 食材准备：按用途分组，列出配料与用量
- 制作步骤：按序号拆分，句首用动词，标明火候与时间
- 小贴士：关键注意事项、替代方案、失败排查
- 变体（可选）：口味调整或配料替换

## 编写规范

- 计量统一：克、毫升、茶匙/汤匙；尽量给出范围（如 8–10 分钟）
- 步骤动词化：切、炒、焖、炖、蒸、烤等置于句首
- 火候明确：小火/中火/大火 + 时间（如中火 5 分钟）
- 分组清晰：食材按「主材/辅材/香料」或「主料/配料/调味」分区
- 结果导向：每步给出“应达到的状态”（如洋葱炒至透明）
- 元数据前置：使用 YAML Frontmatter 填写检索字段
  - 必填：category（目录分类）、tags（检索标签）、nutrition（营养丰富程度）、health（健康推荐程度）
  - 建议：time.prep/cook/total、servings、difficulty、spiciness、flavor
- 分类映射：category 取值与目录一致
  - staple-dishes、noodle-dishes、meat-dishes、vegetable-dishes、soups、other-dishes
- 标签双语化：中文 + 英文/slug（kebab-case），方便通过 /tags/ 聚合与搜索

## 示例：牛肉炖土豆

```markdown
---
title: 牛肉炖土豆
category: meat-dishes
tags:
  - 肉类菜品
  - 牛肉
  - 土豆
  - 新疆
  - 孜然
  - 暖香
  - 微辣
time:
  prep: 10m
  cook: 50m
  total: 60m
servings: 3
difficulty: medium
spiciness: mild
nutrition: high
health: high
flavor:
  - cumin-forward
  - warm
  - layered
---

# 牛肉炖土豆

## 食材准备

- 主材：牛腩 500g、土豆 2 个（切块）、洋葱 1 个（切块）
- 香料：孜然 1 茶匙、八角 1 个、花椒 1/2 茶匙、干辣椒 2 个
- 调味：盐 1 茶匙、酱油 1 汤匙、清水 800ml

## 制作步骤

1. 爆香：中火热油，入洋葱、花椒、干辣椒，炒至洋葱透明
2. 煸香：入牛腩翻炒至表面微焦，加入孜然、八角继续翻炒 30 秒
3. 炖煮：倒入清水与酱油，大火煮沸后转小火焖炖 40 分钟
4. 入土豆：加入土豆块，小火继续炖 15–20 分钟至软糯
5. 收味：加盐调味，开大火 1–2 分钟稍微收汁

## 小贴士

- 香料层次：孜然提供主香，八角与花椒增加厚度；干辣椒点缀辣度
- 时间控制：牛腩软烂为准；土豆保持块形但入口即化
- 替代方案：牛腩可换羊腩；清水可替部分高汤
```

## YAML Frontmatter 元数据规范

- category：目录分类（staple-dishes/noodle-dishes/meat-dishes/vegetable-dishes/soups/other-dishes）
- tags：检索标签（中文 + 英文/slug，示例：新疆、孜然、微辣、cumin-forward、warm）
- time：时间结构（prep/cook/total，单位 m 或 h）
- servings：人数
- difficulty：难度（easy/medium/hard）
- spiciness：辣度（none/mild/medium/hot）
- nutrition：营养丰富程度（low/medium/high 或 1–5）
- health：健康推荐程度（low/medium/high 或 1–5）
- flavor：风味标签（如 cumin-forward、warm、layered）

## 标签命名约定

- 使用 kebab-case 英文 slug（如 cumin-forward、warm），中文标签保持原样
- 建议双语：中文 + 英文/slug，便于 /tags/ 聚合与站内搜索
- 尽量复用常用集合：食材（牛肉、土豆、洋葱）、风味（孜然、暖香、微辣）、场景（工作日快手、周末硬菜）

## 检索建议

- 通过标签页：站点提供 /tags/ 聚合页，点击任意标签可快速筛选所有相关食谱
- 通过站内搜索：输入标签或食材、风味关键词（如 “孜然”“微辣”“牛肉”）
- 通过目录：宽目录仅作大类定位，具体筛选依赖标签

## 失败排查（可放入小贴士）

- 肉不软：延长小火炖煮时间或切更小块
- 汤太淡：适当加盐或少量酱油，并增加收汁时间
- 香料抢味：减少八角/花椒用量，保留孜然为主香
