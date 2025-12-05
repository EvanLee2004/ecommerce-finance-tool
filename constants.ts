import { Platform, ReconStatus } from './types';

export const PLATFORM_OPTIONS = [
  { label: '全部平台', value: Platform.ALL },
  { label: '淘宝', value: Platform.TAOBAO },
  { label: '京东', value: Platform.JD },
];

export const STATUS_OPTIONS = [
  { label: '全部状态', value: ReconStatus.ALL },
  { label: '对账正常', value: ReconStatus.NORMAL },
  { label: '金额异常', value: ReconStatus.MISMATCH },
  { label: '缺少流水', value: ReconStatus.MISSING_PAYMENT },
];

export const MOCK_SHOPS = ['潮流服饰旗舰店', '极客数码专营店', '温馨家居生活馆', '京东自营旗舰店'];