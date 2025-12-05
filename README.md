<div align="center">

# 💰 电商财务通

**智能电商财务对账系统 | 让财务对账变得简单高效**

[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-green?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.12-green?logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[功能特性](#-功能特性) • [快速开始](#-快速开始) • [使用说明](#-使用说明) • [技术架构](#-技术架构) • [截图预览](#-截图预览)

</div>

---

## 📖 项目简介

**电商财务通**是一款专为电商企业设计的财务对账工具，帮助企业快速完成多平台订单与银行流水的对账工作。系统支持淘宝、京东等主流电商平台，能够自动识别表格格式、智能匹配订单，并生成详细的财务分析报表。

### 🎯 核心价值

- **省时高效** - 原本需要数小时的对账工作，现在只需几分钟
- **减少错误** - 自动化处理，避免人工核对产生的遗漏和错误
- **智能分析** - 自动计算毛利率、平台对比、TOP商品等关键指标
- **灵活易用** - 支持多种表格格式，无需手动调整列名

---

## ✨ 功能特性

### 📊 数据导入与处理
- ✅ 支持 **Excel (.xlsx, .xls)** 和 **CSV** 格式
- ✅ **智能列名识别** - 自动适配不同格式的订单表格
- ✅ **多平台支持** - 淘宝、京东订单一键导入
- ✅ **拖拽上传** - 支持文件拖拽，操作简单快捷
- ✅ **文件验证** - 自动检查文件格式和大小（限制50MB）

### 🔍 智能对账
- ✅ **自动匹配** - 根据订单号自动匹配订单与银行流水
- ✅ **异常识别** - 标记金额异常和缺少流水的订单
- ✅ **三种状态**：
  - 🟢 对账正常 - 订单金额与流水一致
  - 🟡 金额异常 - 有流水但金额不匹配
  - 🔴 缺少流水 - 订单存在但流水缺失

### 📈 财务分析
- ✅ **关键指标** - 总收入、总成本、毛利润、毛利率
- ✅ **平台对比** - 淘宝 vs 京东营收和利润分析
- ✅ **商品排行** - TOP 5 高利润商品展示
- ✅ **智能洞察** - AI 生成业务建议和异常提醒
- ✅ **可视化图表** - 使用 Recharts 展示数据趋势

### 🔎 数据筛选与导出
- ✅ **多维筛选** - 按平台、状态、订单号快速过滤
- ✅ **实时搜索** - 订单号模糊查询
- ✅ **CSV 导出** - 一键导出对账结果用于存档

### 💡 其他特性
- ✅ **离线演示模式** - 无需后端也能体验完整功能
- ✅ **健康检查** - 实时显示后端连接状态
- ✅ **响应式设计** - 支持桌面和平板设备

---

## 🚀 快速开始

### 环境要求

- **Node.js** >= 16.0
- **Python** >= 3.10
- **npm** 或 **yarn**

### 安装步骤

#### 1. 克隆项目

```bash
git clone https://github.com/你的用户名/电商财务通.git
cd 电商财务通
```

#### 2. 安装前端依赖

```bash
npm install
```

#### 3. 配置 Python 虚拟环境

```bash
# 创建虚拟环境
python -m venv .venv

# 激活虚拟环境
# macOS/Linux:
source .venv/bin/activate
# Windows:
.venv\Scripts\activate

# 安装后端依赖
pip install -r requirements.txt
```

#### 4. 启动服务

**启动后端服务**（终端1）：
```bash
.venv/bin/uvicorn backend.main:app --reload
```

**启动前端服务**（终端2）：
```bash
npm run dev
```

#### 5. 访问应用

在浏览器中打开：`http://localhost:5173` 或 `http://localhost:3001`

---

## 📝 使用说明

### 第一步：准备数据文件

系统需要三类 Excel/CSV 文件：

#### 1️⃣ **淘宝订单文件**
应包含以下列（系统会自动识别）：
- 订单编号/订单号
- 店铺名称/店铺
- 商品名称/SKU
- 成本价/成本
- 买家实际支付金额/应收金额
- 付款时间/日期

#### 2️⃣ **京东订单文件**
应包含以下列：
- 订单号/订单编号
- 店铺名称/店铺
- 商品名称/SKU
- 成本价/成本
- 订单金额/应收金额
- 下单时间/订单时间

#### 3️⃣ **银行流水文件**
应包含以下列：
- 订单号/商户订单号
- 金额/交易金额

> 💡 **提示**：列名不需要完全一致，系统会智能识别常见的列名格式。

### 第二步：导入数据

1. 进入"数据导入"页面
2. 分别上传三个文件（支持拖拽）
3. 点击"开始处理"按钮
4. 等待处理完成（通常几秒钟）

### 第三步：查看结果

- **对账结果明细** - 查看每笔订单的对账状态
- **财务分析看板** - 查看整体经营数据和图表

### 生成测试数据

如果没有真实数据，可以运行脚本生成测试数据：

```bash
.venv/bin/python 生成测试数据.py
```

会生成3个Excel文件供测试使用。

---

## 🏗️ 技术架构

### 前端技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| React | 19.2 | UI 框架 |
| TypeScript | 5.8 | 类型安全 |
| Vite | 6.2 | 构建工具 |
| Tailwind CSS | - | 样式框架 |
| Recharts | 3.5 | 数据可视化 |
| Lucide React | 0.555 | 图标库 |

### 后端技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| FastAPI | 0.109 | Web 框架 |
| Python | 3.12 | 编程语言 |
| Pandas | 2.2 | 数据处理 |
| Uvicorn | 0.27 | ASGI 服务器 |
| Pydantic | 2.6 | 数据验证 |

### 项目结构

```
电商财务通/
├── backend/                 # 后端服务
│   ├── main.py             # FastAPI 应用主文件
│   └── requirements.txt    # Python 依赖
├── components/             # React 组件
│   ├── FileUpload.tsx      # 文件上传组件
│   ├── Sidebar.tsx         # 侧边栏导航
│   └── StatusBadge.tsx     # 状态标签
├── pages/                  # 页面组件
│   ├── ImportPage.tsx      # 数据导入页
│   ├── ReconciliationPage.tsx  # 对账结果页
│   └── DashboardPage.tsx   # 财务分析页
├── services/               # 服务层
│   ├── api.ts              # API 调用
│   └── mockDataService.ts  # 模拟数据
├── context/                # 状态管理
│   └── FinanceContext.tsx  # 全局状态
├── App.tsx                 # 应用入口
├── types.ts                # TypeScript 类型定义
└── constants.ts            # 常量配置
```

---

## 📸 截图预览

### 数据导入页面
干净简洁的上传界面，支持拖拽文件。

### 对账结果页面
清晰展示每笔订单的对账状态，支持筛选和导出。

### 财务分析看板
关键指标卡片 + 可视化图表，一目了然。

---

## 🛠️ 开发指南

### VS Code 配置

项目已包含 `.vscode` 配置：
- 按 `F5` 启动调试模式
- `Cmd + Shift + P` → "Run Task" → "同时启动前后端"

### API 接口

#### `GET /`
健康检查接口

#### `POST /upload`
上传文件并处理对账

**请求参数**：
- `taobao_file`: 淘宝订单文件（可选）
- `jd_file`: 京东订单文件（可选）
- `bank_file`: 银行流水文件（可选）

**响应示例**：
```json
{
  "records": [...],
  "metrics": {...},
  "stats": {
    "taobao": 50,
    "jd": 40,
    "flow": 79
  }
}
```

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源。

---

## 💬 联系方式

如有问题或建议，欢迎通过以下方式联系：

- 📧 邮箱：lmh20251202@gmail.com
- 🐛 Issue：[GitHub Issues](https://github.com/EvanLee2004/ecommerce-finance-tool/issues)

---

## 🌟 Star History

如果这个项目对你有帮助，请给个 ⭐️ Star 支持一下！

---

<div align="center">

**用心打造，让电商财务管理更简单** ❤️

Made with ❤️ by EvanLee

</div>
