import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
const resolveUrl = (path: string) =>
  path.startsWith('http') ? path : `${API_BASE}${path}`;

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // 重要：允許跨域傳送 cookie
});

// 回應攔截器：處理 401 未授權
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // 如果不是在登入頁面，則重導向
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const apiFetch = (path: string, init?: RequestInit) =>
  fetch(resolveUrl(path), init);

export const api = {
  get: axiosInstance.get,
  post: axiosInstance.post,
  put: axiosInstance.put,
  delete: axiosInstance.delete,

  // Leads
  getLeads: async (status?: string) => {
    const response = await axiosInstance.get('/leads', { params: { status } });
    return response.data;
  },
  createLead: async (data: any) => {
    const response = await axiosInstance.post('/leads', data);
    return response.data;
  },
  updateLead: async (id: number, data: any) => {
    const response = await axiosInstance.put(`/leads/${id}`, data);
    return response.data;
  },
  deleteLead: async (id: number) => {
    const response = await axiosInstance.delete(`/leads/${id}`);
    return response.data;
  }
};

export default api;