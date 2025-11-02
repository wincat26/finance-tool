import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
const resolveUrl = (path: string) =>
  path.startsWith('http') ? path : `${API_BASE}${path}`;

export const apiClient = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
});

export const apiFetch = (path: string, init?: RequestInit) =>
  fetch(resolveUrl(path), init);