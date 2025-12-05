export enum Platform {
  ALL = '全部',
  TAOBAO = 'TB',
  JD = 'JD'
}

export enum ReconStatus {
  ALL = '全部',
  NORMAL = '对账正常',
  MISMATCH = '金额异常',
  MISSING_PAYMENT = '缺少流水'
}

export interface OrderRecord {
  orderId: string;
  platform: Platform;
  shopName: string;
  skuName: string;
  cost: number;
  receivableAmount: number; // The amount expected
  actualAmount: number;     // From payment flow
  status: ReconStatus;
  diff: number;
  date: string;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalCost: number;
  totalGrossProfit: number;
  grossMargin: number;
  platformStats: {
    platform: Platform;
    revenue: number;
    profit: number;
    margin: number;
  }[];
  topSkus: {
    name: string;
    profit: number;
  }[];
  insights: string[];
}