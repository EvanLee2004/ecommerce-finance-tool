
import { OrderRecord, Platform, ReconStatus, DashboardMetrics } from '../types';
import { MOCK_SHOPS } from '../constants';

const generateRandomId = () => Math.random().toString(36).substr(2, 9).toUpperCase();

export const generateMockData = (count: number): OrderRecord[] => {
  const data: OrderRecord[] = [];
  const platforms = [Platform.TAOBAO, Platform.JD];

  for (let i = 0; i < count; i++) {
    const platform = platforms[Math.floor(Math.random() * platforms.length)];
    const receivable = parseFloat((Math.random() * 500 + 50).toFixed(2));
    const cost = parseFloat((receivable * (Math.random() * 0.4 + 0.3)).toFixed(2)); // 30-70% cost
    
    // Simulate status distribution - 大部分对账正常，少量异常
    const rand = Math.random();
    let status = ReconStatus.NORMAL;
    let actual = receivable;

    if (rand > 0.90) {
      // 10% 金额异常
      status = ReconStatus.MISMATCH;
      actual = parseFloat((receivable * 0.9 + (Math.random() * 10)).toFixed(2));
    } else if (rand > 0.85) {
      // 5% 缺少流水
      status = ReconStatus.MISSING_PAYMENT;
      actual = 0;
    }

    data.push({
      orderId: generateRandomId(),
      platform,
      shopName: MOCK_SHOPS[Math.floor(Math.random() * MOCK_SHOPS.length)],
      skuName: `示例商品 SKU-${Math.floor(Math.random() * 100)}`,
      cost,
      receivableAmount: receivable,
      actualAmount: actual,
      status,
      diff: parseFloat((actual - receivable).toFixed(2)),
      date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString().split('T')[0],
    });
  }
  return data;
};

export const calculateMetrics = (records: OrderRecord[]): DashboardMetrics => {
  let totalRevenue = 0;
  let totalCost = 0;
  
  // Platform Aggregation
  const platMap = new Map<Platform, { revenue: number; cost: number }>();
  platMap.set(Platform.TAOBAO, { revenue: 0, cost: 0 });
  platMap.set(Platform.JD, { revenue: 0, cost: 0 });

  // SKU Aggregation
  const skuMap = new Map<string, number>();

  records.forEach(r => {
    totalRevenue += r.actualAmount;
    totalCost += r.cost;

    if (r.platform !== Platform.ALL) {
      const p = platMap.get(r.platform)!;
      p.revenue += r.actualAmount;
      p.cost += r.cost;
    }

    const currentSkuProfit = skuMap.get(r.skuName) || 0;
    skuMap.set(r.skuName, currentSkuProfit + (r.actualAmount - r.cost));
  });

  const totalGrossProfit = totalRevenue - totalCost;
  const grossMargin = totalRevenue > 0 ? (totalGrossProfit / totalRevenue) * 100 : 0;

  const platformStats = [Platform.TAOBAO, Platform.JD].map(p => {
    const data = platMap.get(p)!;
    const profit = data.revenue - data.cost;
    return {
      platform: p,
      revenue: data.revenue,
      profit: profit,
      margin: data.revenue > 0 ? (profit / data.revenue) * 100 : 0,
    };
  });

  const topSkus = Array.from(skuMap.entries())
    .map(([name, profit]) => ({ name, profit }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 5);

  // Generate Rules-Based Insights in Chinese
  const insights = [
    `总收入达到 ¥${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}，整体毛利率为 ${grossMargin.toFixed(1)}%。`,
    platformStats[0].margin > platformStats[1].margin 
      ? `淘宝平台毛利率高于京东 ${(platformStats[0].margin - platformStats[1].margin).toFixed(1)}%。`
      : `京东平台毛利率高于淘宝 ${(platformStats[1].margin - platformStats[0].margin).toFixed(1)}%。`,
    `表现最好的商品是 ${topSkus[0]?.name || '无'}，贡献毛利 ¥${topSkus[0]?.profit.toFixed(0) || 0}。`,
    `当前有 ${records.filter(r => r.status !== ReconStatus.NORMAL).length} 笔订单需要财务重点核对。`
  ];

  return {
    totalRevenue,
    totalCost,
    totalGrossProfit,
    grossMargin,
    platformStats,
    topSkus,
    insights
  };
};

// 新增：直接生成前端需要的完整 API 响应格式
export const generateMockResponse = () => {
  const records = generateMockData(150);
  const metrics = calculateMetrics(records);
  return {
    records,
    metrics,
    stats: {
      taobao: Math.floor(records.length * 0.4),
      jd: Math.floor(records.length * 0.4),
      flow: Math.floor(records.length * 0.8), // 模拟部分流水缺失
    }
  };
};
