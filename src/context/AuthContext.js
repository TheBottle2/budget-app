import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authAPI, setOnAuthFailure } from '../api/client';

const AuthContext = createContext(null);

const isWeb = typeof window !== 'undefined';

const storage = {
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

export function AuthProvider({ children }) {
  const [kullanici, setKullanici] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    tokenKontrol();
    setOnAuthFailure(() => cikisYap);
  }, []);

  const tokenKontrol = async () => {
    try {
      const token = await storage.getItem('auth_token');
      const kullaniciData = await storage.getItem('kullanici');
      if (token && kullaniciData) {
        setKullanici(JSON.parse(kullaniciData));
      }
    } catch (e) {
      console.error('Token kontrol hatası:', e);
    } finally {
      setYukleniyor(false);
    }
  };

  const girisYap = async (email, sifre) => {
    try {
      const res = await authAPI.login({ email, sifre });
      await storage.setItem('auth_token', res.data.token);
      await storage.setItem('kullanici', JSON.stringify(res.data.kullanici));
      setKullanici(res.data.kullanici);
    } catch (e) {
      console.error('[AuthContext] Giriş hatası:', e?.response?.data || e.message);
      throw e;
    }
  };

  const kayitOl = async (ad, email, sifre) => {
    try {
      const res = await authAPI.register({ ad, email, sifre });
      await storage.setItem('auth_token', res.data.token);
      await storage.setItem('kullanici', JSON.stringify(res.data.kullanici));
      setKullanici(res.data.kullanici);
    } catch (e) {
      console.error('[AuthContext] Kayıt hatası:', e?.response?.data || e.message);
      throw e;
    }
  };

  const cikisYap = async () => {
    console.log('[AuthContext] Çıkış yapılıyor...');
    try {
      await authAPI.logout();
      console.log('[AuthContext] Logout API tamamlandı');
    } catch (e) {
      console.error('[AuthContext] Logout API hatası:', e);
    }
    try {
      await storage.deleteItem('auth_token');
      await storage.deleteItem('kullanici');
      console.log('[AuthContext] Storage temizlendi');
    } catch (e) {
      console.error('[AuthContext] Storage temizleme hatası:', e);
    }
    setKullanici(null);
    console.log('[AuthContext] Çıkış tamamlandı, kullanici null');
  };

  return (
    <AuthContext.Provider value={{ kullanici, yukleniyor, girisYap, kayitOl, cikisYap }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};