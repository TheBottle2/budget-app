import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { kayitOl } = useAuth();
  const [ad, setAd]       = useState('');
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const kayitOlHandle = async () => {
    if (!ad || !email || !sifre) return Alert.alert('Hata', 'Tüm alanları doldurun!');
    if (!emailRegex.test(email)) return Alert.alert('Hata', 'Geçerli bir e-posta girin!');
    if (sifre.length < 8) return Alert.alert('Hata', 'Şifre en az 8 karakter olmalıdır!');
    try {
      setYukleniyor(true);
      await kayitOl(ad, email, sifre);
    } catch (e) {
      const mesaj = e.response?.data?.mesaj || e.response?.data?.hatalar?.[0]?.message || 'Kayıt başarısız!';
      Alert.alert('Hata', mesaj);
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.icerik}>
        <Text style={styles.baslik}>💸 Kayıt Ol</Text>
        <Text style={styles.altBaslik}>Yeni hesap oluştur</Text>

        <TextInput
          style={styles.input}
          placeholder="Ad Soyad"
          placeholderTextColor="#999"
          value={ad}
          onChangeText={setAd}
        />
        <TextInput
          style={styles.input}
          placeholder="E-posta"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Şifre (en az 8 karakter, büyük/küçük harf, rakam, özel karakter)"
          placeholderTextColor="#999"
          value={sifre}
          onChangeText={setSifre}
          secureTextEntry
        />

        <TouchableOpacity style={styles.btn} onPress={kayitOlHandle} disabled={yukleniyor}>
          <Text style={styles.btnText}>{yukleniyor ? 'Kayıt olunuyor...' : 'Kayıt Ol'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Zaten hesabın var mı? Giriş yap</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#F0F0F7' },
  icerik:     { flex: 1, justifyContent: 'center', padding: 24 },
  baslik:     { fontSize: 28, fontWeight: 'bold', color: '#6C63FF', textAlign: 'center', marginBottom: 8 },
  altBaslik:  { fontSize: 16, color: '#999', textAlign: 'center', marginBottom: 32 },
  input:      {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    elevation: 2,
    color: '#333',
  },
  btn:        {
    backgroundColor: '#6C63FF', borderRadius: 12,
    padding: 16, alignItems: 'center', marginBottom: 16,
  },
  btnText:    { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  linkText:   { color: '#6C63FF', textAlign: 'center', fontSize: 15 },
});