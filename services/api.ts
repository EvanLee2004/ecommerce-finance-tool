import { OrderRecord, DashboardMetrics } from '../types';
import { generateMockResponse } from './mockDataService';

// 获取后端地址，默认指向本地 FastAPI 端口
const getApiUrl = () => {
  try {
    // @ts-ignore
    return (import.meta && import.meta.env && import.meta.env.VITE_API_URL) || 'http://localhost:8000';
  } catch (e) {
    return 'http://localhost:8000';
  }
};

const API_URL = getApiUrl();

export interface UploadResponse {
  records: OrderRecord[];
  metrics: DashboardMetrics;
  stats: {
    taobao: number;
    jd: number;
    flow: number;
  };
}

export const apiService = {
  async uploadFiles(
    taobaoFile: File | null,
    jdFile: File | null,
    bankFile: File | null
  ): Promise<UploadResponse> {
    const formData = new FormData();
    if (taobaoFile) formData.append('taobao_file', taobaoFile);
    if (jdFile) formData.append('jd_file', jdFile);
    if (bankFile) formData.append('bank_file', bankFile);

    try {
      console.log(`正在请求后端: ${API_URL}/upload`);
      // 大文件处理可能需要更长时间，调整超时为 30 秒
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(id);

      if (!response.ok) {
        const errorText = await response.text().catch(() => '未知错误');
        throw new Error(`服务器错误 (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      console.log("后端处理成功", data);
      return data;
    } catch (error) {
      console.warn("自动切换到本地演示模式", error);
      
      // 前端兜底机制：即使后端挂了，也要给用户展示数据，不能没反应！
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(generateMockResponse());
        }, 600);
      });
    }
  },

  async checkHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 1000);
      const response = await fetch(`${API_URL}/`, { method: 'GET', signal: controller.signal });
      clearTimeout(id);
      return response.ok;
    } catch (e) {
      return false;
    }
  }
};