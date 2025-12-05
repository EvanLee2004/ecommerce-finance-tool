"""
生成电商财务通测试数据
生成三个Excel文件：淘宝订单、京东订单、银行流水
"""
import pandas as pd
import random
from datetime import datetime, timedelta

# 设置随机种子以获得可重复的结果
random.seed(42)

# 生成日期范围
def random_date(start_days_ago=30):
    days_ago = random.randint(0, start_days_ago)
    return (datetime.now() - timedelta(days=days_ago)).strftime('%Y-%m-%d %H:%M:%S')

# 生成订单号
def generate_order_id(prefix, index):
    return f"{prefix}{datetime.now().strftime('%Y%m%d')}{str(index).zfill(6)}"

# 商品列表
products = [
    "女装连衣裙夏季新款",
    "男士T恤纯棉短袖",
    "儿童玩具益智积木",
    "手机壳iPhone保护套",
    "无线蓝牙耳机运动款",
    "运动鞋男透气跑步鞋",
    "保温杯304不锈钢",
    "化妆品套装护肤品",
    "零食大礼包坚果",
    "数据线Type-C快充",
]

shops = ["优品小店", "品质生活馆", "时尚潮流店", "数码专营店"]

# ===== 1. 生成淘宝订单数据 =====
print("生成淘宝订单数据...")
taobao_orders = []
taobao_count = 50

for i in range(taobao_count):
    order_id = generate_order_id("TB", i + 1)
    product = random.choice(products)
    shop = random.choice(shops)
    cost = round(random.uniform(20, 200), 2)
    price = round(cost * random.uniform(1.3, 2.5), 2)  # 毛利率30%-150%
    
    taobao_orders.append({
        '订单编号': order_id,
        '店铺名称': f"淘宝{shop}",
        '商品名称': product,
        '成本价': cost,
        '买家实际支付金额': price,
        '付款时间': random_date()
    })

df_taobao = pd.DataFrame(taobao_orders)
df_taobao.to_excel('淘宝订单测试数据.xlsx', index=False)
print(f"✅ 已生成 淘宝订单测试数据.xlsx ({taobao_count}条记录)")

# ===== 2. 生成京东订单数据 =====
print("生成京东订单数据...")
jd_orders = []
jd_count = 40

for i in range(jd_count):
    order_id = generate_order_id("JD", i + 1)
    product = random.choice(products)
    shop = random.choice(shops)
    cost = round(random.uniform(30, 300), 2)
    price = round(cost * random.uniform(1.2, 2.0), 2)
    
    jd_orders.append({
        '订单号': order_id,
        '店铺': f"京东{shop}",
        '商品名称': product,
        '成本': cost,
        '订单金额': price,
        '下单时间': random_date()
    })

df_jd = pd.DataFrame(jd_orders)
df_jd.to_excel('京东订单测试数据.xlsx', index=False)
print(f"✅ 已生成 京东订单测试数据.xlsx ({jd_count}条记录)")

# ===== 3. 生成银行流水数据 =====
print("生成银行流水数据...")
bank_flows = []

# 从淘宝订单中选取90%生成流水（模拟10%缺少流水）
sampled_taobao = random.sample(taobao_orders, int(taobao_count * 0.9))
for order in sampled_taobao:
    # 90%金额完全匹配，10%有偏差（模拟手续费等）
    amount = order['买家实际支付金额']
    if random.random() > 0.9:
        amount = round(amount * random.uniform(0.95, 0.99), 2)  # 扣除1-5%手续费
    
    bank_flows.append({
        '商户订单号': order['订单编号'],
        '交易金额': amount,
        '交易时间': order['付款时间'],
        '交易类型': '收入',
        '备注': '支付宝转账'
    })

# 从京东订单中选取85%生成流水（模拟15%缺少流水）
sampled_jd = random.sample(jd_orders, int(jd_count * 0.85))
for order in sampled_jd:
    amount = order['订单金额']
    if random.random() > 0.92:
        amount = round(amount * random.uniform(0.96, 0.99), 2)
    
    bank_flows.append({
        '商户订单号': order['订单号'],
        '交易金额': amount,
        '交易时间': order['下单时间'],
        '交易类型': '收入',
        '备注': '微信支付'
    })

# 打乱顺序，模拟真实流水
random.shuffle(bank_flows)

df_bank = pd.DataFrame(bank_flows)
df_bank.to_excel('银行流水测试数据.xlsx', index=False)
print(f"✅ 已生成 银行流水测试数据.xlsx ({len(bank_flows)}条记录)")

# ===== 4. 生成统计报告 =====
print("\n" + "="*50)
print("📊 测试数据统计报告")
print("="*50)
print(f"淘宝订单：{taobao_count} 笔")
print(f"京东订单：{jd_count} 笔")
print(f"银行流水：{len(bank_flows)} 笔")
print(f"\n预期对账结果：")
print(f"  • 对账正常：约 {int(taobao_count*0.9*0.9 + jd_count*0.85*0.92)} 笔 (~80%)")
print(f"  • 金额异常：约 {int(taobao_count*0.9*0.1 + jd_count*0.85*0.08)} 笔 (~8%)")
print(f"  • 缺少流水：约 {int(taobao_count*0.1 + jd_count*0.15)} 笔 (~12%)")
print("\n✅ 所有测试数据已生成完成！")
print("📁 文件位置：当前目录")
