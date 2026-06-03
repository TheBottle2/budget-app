import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authAPI } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [kullanici, setKullanici] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => { tokenKontrol(); }, []);

  const tokenKontrol = async () => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      const kullaniciData = await SecureStore.getItemAsync('kullanici');
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
    const res = await authAPI.login({ email, sifre });
    await SecureStore.setItemAsync('auth_token', res.data.token);
    await SecureStore.setItemAsync('kullanici', JSON.stringify(res.data.kullanici));
    setKullanici(res.data.kullanici);
  };

  const kayitOl = async (ad, email, sifre) => {
    const res = await authAPI.register({ ad, email, sifre });
    await SecureStore.setItemAsync('auth_token', res.data.token);
    await SecureStore.setItemAsync('kullanici', JSON.stringify(res.data.kullanici));
    setKullanici(res.data.kullanici);
  };

  const cikisYap = async () => {
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('kullanici');
    setKullanici(null);
  };

  return (
    <AuthContext.Provider value={{ kullanici, yukleniyor, girisYap, kayitOl, cikisYap }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
