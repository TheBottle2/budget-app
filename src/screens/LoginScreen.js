import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen({ navigation }) {
  const { girisYap } = useAuth();
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const girisYapHandle = async () => {
    if (!email || !sifre) return Alert.alert('Hata', 'Tüm alanları doldurun!');
    if (!EMAIL_REGEX.test(email)) return Alert.alert('Hata', 'Geçerli bir e-posta girin!');

    try {
      setYukleniyor(true);
      await girisYap(email, sifre);
    } catch (e) {
      const mesaj = e.response?.data?.mesaj || 'E-posta veya şifre hatalı!';
      Alert.alert('Hata', mesaj);
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.icerik}>
        <Text style={styles.baslik}>💸 Bütçe Yöneticisi</Text>
        <Text style={styles.altBaslik}>Hesabına giriş yap</Text>

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
          placeholder="Şifre"
          placeholderTextColor="#999"
          value={sifre}
          onChangeText={setSifre}
          secureTextEntry
        />

        <TouchableOpacity style={styles.btn} onPress={girisYapHandle} disabled={yukleniyor}>
          <Text style={styles.btnText}>{yukleniyor ? 'Giriş yapılıyor...' : 'Giriş Yap'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Hesabın yok mu? Kayıt ol</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F0F7' },
  icerik: { flex: 1, justifyContent: 'center', padding: 24 },
  baslik: { fontSize: 28, fontWeight: 'bold', color: '#6C63FF', textAlign: 'center', marginBottom: 8 },
  altBaslik: { fontSize: 16, color: '#999', textAlign: 'center', marginBottom: 32 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    elevation: 2,
    color: '#333',
  },
  btn: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  btnText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  linkText: { color: '#6C63FF', textAlign: 'center', fontSize: 15 },
});
