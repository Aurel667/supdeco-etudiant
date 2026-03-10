import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 
    Accept: 'application/json', 'Content-Type': 'application/json',
  },
  withCredentials: false,
  validateStatus: () => true,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  (config as any)._startTime = Date.now();
  
  return config;
});

export default client