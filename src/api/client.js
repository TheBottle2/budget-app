import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

const isWeb = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const secureStorage = {
  async getItem(key) {
    if (isWeb) return localStorage.getItem(key);
    return SecureStore.getItemAsync(key);
  },
  async setItem(key, value) {
    if (isWeb) return localStorage.setItem(key, value);
    return SecureStore.setItemAsync(key, value);
  },
  async deleteItem(key) {
    if (isWeb) return localStorage.removeItem(key);
    return SecureStore.deleteItemAsync(key);
  },
};

const getBaseURL = () => {
  console.log('[getBaseURL] Checking URL...');
  console.log('[getBaseURL] window.location:', typeof window !== 'undefined' ? window.location : 'not defined');

  if (typeof window !== 'undefined' && window.location?.hostname) {
    const url = `http://${window.location.hostname}:3000/api`;
    console.log('[getBaseURL] Using web URL:', url);
    return url;
  }

  if (Constants?.expoConfig?.hostUri) {
    const url = `http://${Constants.expoConfig.hostUri.split(':')[0]}:3000/api`;
    console.log('[getBaseURL] Using expo hostUri URL:', url);
    return url;
  }

  const productionURL = Constants?.expoConfig?.extra?.API_URL;
  if (productionURL) {
    console.log('[getBaseURL] Using productionURL:', productionURL);
    return productionURL;
  }

  console.error('[getBaseURL] NO VALID URL FOUND!');
  throw new Error('API_URL tanımlı değil! app.json extra alanını kontrol et.');
};

const client = axios.create({
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

let onAuthFailure = null;
export function setOnAuthFailure(callback) {
  onAuthFailure = callback;
}

client.interceptors.request.use(
  async (config) => {
    try {
      if (!config.baseURL) {
        config.baseURL = getBaseURL();
      }
      console.log('[API Request]', config.method?.toUpperCase(), config.baseURL + config.url);
      console.log('[API Request] Data:', JSON.stringify(config.data));
      const token = await secureStorage.getItem('auth_token');
      if (token) {
        console.log('[API Request] Token found, adding Bearer');
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.log('[API Request] No token found');
      }
    } catch (e) {
      console.error('[API Request] Error:', e);
    }
    return config;
  },
  (error) => {
    console.error('[API Request Interceptor Error]', error);
    return Promise.reject(error);
  }
);

client.interceptors.response.use(
  (response) => {
    console.log('[API Response Success]', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error('[API Response Error]');
    console.error('  URL:', error.config?.url);
    console.error('  Status:', error.response?.status);
    console.error('  Data:', JSON.stringify(error.response?.data));
    console.error('  Message:', error.message);
    console.error('  Full Error:', error);

    if (error.response?.status === 401) {
      try {
        await secureStorage.deleteItem('auth_token');
        await secureStorage.deleteItem('kullanici');
      } catch {}
      if (onAuthFailure) onAuthFailure();
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => {
    console.log('[authAPI.register] Called with:', JSON.stringify({ ...data, sifre: '[HIDDEN]' }));
    return client.post('/auth/register', data);
  },
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