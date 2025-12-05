from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
import pandas as pd
import io
from datetime import datetime
import random

app = FastAPI(title="电商财务通 API")

# 配置 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应该设置具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """健康检查端点"""
    return {"status": "ok", "message": "电商财务通后端服务运行中"}


@app.post("/upload")
async def upload_files(
    taobao_file: Optional[UploadFile] = File(None),
    jd_file: Optional[UploadFile] = File(None),
    bank_file: Optional[UploadFile] = File(None)
):
    """
    处理上传的文件并进行对账
    """
    try:
        records = []
        stats = {"taobao": 0, "jd": 0, "flow": 0}
        
        # 处理淘宝订单
        if taobao_file:
            tb_data = await process_taobao_file(taobao_file)
            records.extend(tb_data)
            stats["taobao"] = len(tb_data)
        
        # 处理京东订单
        if jd_file:
            jd_data = await process_jd_file(jd_file)
            records.extend(jd_data)
            stats["jd"] = len(jd_data)
        
        # 处理银行流水
        bank_records = []
        if bank_file:
            bank_records = await process_bank_file(bank_file)
            stats["flow"] = len(bank_records)
        
        # 执行对账逻辑
        reconciled_records = reconcile_orders(records, bank_records)
        
        # 计算财务指标
        metrics = calculate_metrics(reconciled_records)
        
        return {
            "records": reconciled_records,
            "metrics": metrics,
            "stats": stats
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"处理文件时出错: {str(e)}")


async def process_taobao_file(file: UploadFile) -> List[dict]:
    """处理淘宝订单文件"""
    content = await file.read()
    
    try:
        # 尝试读取 Excel
        if file.filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(io.BytesIO(content))
        else:
            df = pd.read_csv(io.BytesIO(content), encoding='utf-8')
    except UnicodeDecodeError:
        df = pd.read_csv(io.BytesIO(content), encoding='gbk')
    
    # 智能列名映射 - 支持多种可能的列名
    column_mapping = {
        '订单编号': ['订单编号', '订单号', 'order_id', '主订单编号'],
        '店铺': ['店铺名称', '店铺', 'shop_name', '卖家昵称'],
        'SKU': ['商品名称', 'SKU', '宝贝标题', '商品'],
        '成本': ['成本价', '成本', 'cost', '商品成本'],
        '应收金额': ['买家实际支付金额', '应收金额', '实付金额', '订单金额'],
        '日期': ['付款时间', '下单时间', '订单创建时间', '日期']
    }
    
    # 自动识别列名
    mapped_columns = {}
    for target, possibilities in column_mapping.items():
        for col in df.columns:
            if col in possibilities:
                mapped_columns[col] = target
                break
    
    df = df.rename(columns=mapped_columns)
    
    records = []
    for _, row in df.iterrows():
        try:
            record = {
                "orderId": str(row.get('订单编号', f'TB{random.randint(10000, 99999)}')),
                "platform": "TB",
                "shopName": str(row.get('店铺', '淘宝店铺')),
                "skuName": str(row.get('SKU', '商品')),
                "cost": float(row.get('成本', 0)),
                "receivableAmount": float(row.get('应收金额', 0)),
                "actualAmount": 0,  # 待对账
                "status": "缺少流水",
                "diff": 0,
                "date": str(row.get('日期', datetime.now().strftime('%Y-%m-%d')))
            }
            records.append(record)
        except Exception as e:
            continue
    
    return records


async def process_jd_file(file: UploadFile) -> List[dict]:
    """处理京东订单文件"""
    content = await file.read()
    
    try:
        if file.filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(io.BytesIO(content))
        else:
            df = pd.read_csv(io.BytesIO(content), encoding='utf-8')
    except UnicodeDecodeError:
        df = pd.read_csv(io.BytesIO(content), encoding='gbk')
    
    column_mapping = {
        '订单编号': ['订单号', '订单编号', '父订单号'],
        '店铺': ['店铺名称', '店铺', '商家名称'],
        'SKU': ['商品名称', 'SKU名称', '商品'],
        '成本': ['成本价', '成本'],
        '应收金额': ['订单金额', '应收金额', '实付金额'],
        '日期': ['下单时间', '订单时间', '完成时间']
    }
    
    mapped_columns = {}
    for target, possibilities in column_mapping.items():
        for col in df.columns:
            if col in possibilities:
                mapped_columns[col] = target
                break
    
    df = df.rename(columns=mapped_columns)
    
    records = []
    for _, row in df.iterrows():
        try:
            record = {
                "orderId": str(row.get('订单编号', f'JD{random.randint(10000, 99999)}')),
                "platform": "JD",
                "shopName": str(row.get('店铺', '京东店铺')),
                "skuName": str(row.get('SKU', '商品')),
                "cost": float(row.get('成本', 0)),
                "receivableAmount": float(row.get('应收金额', 0)),
                "actualAmount": 0,
                "status": "缺少流水",
                "diff": 0,
                "date": str(row.get('日期', datetime.now().strftime('%Y-%m-%d')))
            }
            records.append(record)
        except Exception:
            continue
    
    return records


async def process_bank_file(file: UploadFile) -> List[dict]:
    """处理银行/支付宝流水文件"""
    content = await file.read()
    
    try:
        if file.filename.endswith(('.xlsx', '.xls')):
            df = pd.read_excel(io.BytesIO(content))
        else:
            df = pd.read_csv(io.BytesIO(content), encoding='utf-8')
    except UnicodeDecodeError:
        df = pd.read_csv(io.BytesIO(content), encoding='gbk')
    
    column_mapping = {
        '订单号': ['订单号', '商户订单号', '交易订单号', '关联订单号'],
        '金额': ['金额', '交易金额', '收入金额', '实收金额'],
    }
    
    mapped_columns = {}
    for target, possibilities in column_mapping.items():
        for col in df.columns:
            if col in possibilities:
                mapped_columns[col] = target
                break
    
    df = df.rename(columns=mapped_columns)
    
    records = []
    for _, row in df.iterrows():
        try:
            record = {
                "orderId": str(row.get('订单号', '')),
                "amount": abs(float(row.get('金额', 0)))
            }
            if record["orderId"] and record["amount"] > 0:
                records.append(record)
        except Exception:
            continue
    
    return records


def reconcile_orders(orders: List[dict], bank_records: List[dict]) -> List[dict]:
    """对账逻辑：匹配订单和银行流水"""
    # 创建银行流水字典，便于快速查找
    bank_dict = {record["orderId"]: record["amount"] for record in bank_records}
    
    for order in orders:
        order_id = order["orderId"]
        if order_id in bank_dict:
            order["actualAmount"] = bank_dict[order_id]
            diff = order["actualAmount"] - order["receivableAmount"]
            order["diff"] = round(diff, 2)
            
            # 判断对账状态
            if abs(diff) < 0.01:  # 误差小于1分钱视为正常
                order["status"] = "对账正常"
            else:
                order["status"] = "金额异常"
        else:
            order["actualAmount"] = 0
            order["diff"] = -order["receivableAmount"]
            order["status"] = "缺少流水"
    
    return orders


def calculate_metrics(records: List[dict]) -> dict:
    """计算财务指标"""
    if not records:
        return {
            "totalRevenue": 0,
            "totalCost": 0,
            "totalGrossProfit": 0,
            "grossMargin": 0,
            "platformStats": [],
            "topSkus": [],
            "insights": ["暂无数据"]
        }
    
    df = pd.DataFrame(records)
    
    # 整体指标
    total_revenue = df["receivableAmount"].sum()
    total_cost = df["cost"].sum()
    total_profit = total_revenue - total_cost
    gross_margin = (total_profit / total_revenue * 100) if total_revenue > 0 else 0
    
    # 平台统计
    platform_stats = []
    for platform in df["platform"].unique():
        platform_df = df[df["platform"] == platform]
        revenue = platform_df["receivableAmount"].sum()
        cost = platform_df["cost"].sum()
        profit = revenue - cost
        margin = (profit / revenue * 100) if revenue > 0 else 0
        
        platform_stats.append({
            "platform": platform,
            "revenue": round(revenue, 2),
            "profit": round(profit, 2),
            "margin": round(margin, 2)
        })
    
    # TOP SKU
    sku_profit = df.groupby("skuName").apply(
        lambda x: (x["receivableAmount"].sum() - x["cost"].sum())
    ).sort_values(ascending=False).head(5)
    
    top_skus = [{"name": name, "profit": round(profit, 2)} 
                for name, profit in sku_profit.items()]
    
    # 智能洞察
    insights = []
    best_platform = max(platform_stats, key=lambda x: x["margin"])
    insights.append(f"{best_platform['platform']} 平台毛利率最高，达 {best_platform['margin']:.1f}%")
    
    abnormal_count = len(df[df["status"] != "对账正常"])
    if abnormal_count > 0:
        insights.append(f"发现 {abnormal_count} 笔异常订单，需要人工核查")
    
    return {
        "totalRevenue": round(total_revenue, 2),
        "totalCost": round(total_cost, 2),
        "totalGrossProfit": round(total_profit, 2),
        "grossMargin": round(gross_margin, 2),
        "platformStats": platform_stats,
        "topSkus": top_skus,
        "insights": insights
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
