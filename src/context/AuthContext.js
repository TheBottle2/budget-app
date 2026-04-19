import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [kullanici, setKullanici] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => { tokenKontrol(); }, []);

  const tokenKontrol = async () => {
    try {
      const token         = await AsyncStorage.getItem('token');
      const kullaniciData = await AsyncStorage.getItem('kullanici');
      if (token && kullaniciData) setKullanici(JSON.parse(kullaniciData));
    } catch (e) {
      console.error('Token kontrol hatası:', e);
    } finally {
      setYukleniyor(false);
    }
  };

  const girisYap = async (email, sifre) => {
    const res = await authAPI.login({ email, sifre });
    await AsyncStorage.setItem('token',     res.data.token);
    await AsyncStorage.setItem('kullanici', JSON.stringify(res.data.kullanici));
    setKullanici(res.data.kullanici);
  };

  const kayitOl = async (ad, email, sifre) => {
    const res = await authAPI.register({ ad, email, sifre });
    await AsyncStorage.setItem('token',     res.data.token);
    await AsyncStorage.setItem('kullanici', JSON.stringify(res.data.kullanici));
    setKullanici(res.data.kullanici);
  };

  const cikisYap = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('kullanici');
    setKullanici(null);
  };

  return (
    <AuthContext.Provider value={{ kullanici, yukleniyor, girisYap, kayitOl, cikisYap }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);