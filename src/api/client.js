import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const getBaseURL = () => {
  if (Constants.expoConfig?.hostUri) {
    return `http://${Constants.expoConfig.hostUri.split(':')[0]}:3000/api`;
  }
  const productionURL = Constants.expoConfig?.extra?.API_URL;
  if (productionURL) return productionURL;
  if (__DEV__) {
    return 'http://192.168.1.100:3000/api';
  }
  throw new Error('API_URL tanımlı değil! app.json extra alanını kontrol et.');
};

const client = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch (e) {
      console.error('Token alınamadı:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('kullanici');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => client.post('/auth/register', data),
  login: (data) => client.post('/auth/login', data),
  logout: () => client.post('/auth/logout'),
};

export const transactionAPI = {
  getAll: (params) => client.get('/transactions', { params }),
  create: (data) => client.post('/transactions', data),
  patch: (id, data) => client.patch(`/transactions/${id}`, data),
  delete: (id) => client.delete(`/transactions/${id}`),
};

export default client;
