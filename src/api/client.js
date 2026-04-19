import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const getBaseURL = () => {
  const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
  if (debuggerHost) return `http://${debuggerHost}:3000/api`;
  return 'http://172.16.99.45:3000/api';
};

const API_URL = getBaseURL();

const client = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

client.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => client.post('/auth/register', data),
  login:    (data) => client.post('/auth/login', data),
  logout:   ()     => client.post('/auth/logout'),
};

export const transactionAPI = {
  getAll:   (params)    => client.get('/transactions', { params }),
  create:   (data)      => client.post('/transactions', data),
  patch:    (id, data)  => client.patch(`/transactions/${id}`, data),
  delete:   (id)        => client.delete(`/transactions/${id}`),
};

export default client;