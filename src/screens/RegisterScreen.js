import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SIFRE_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/;

export default function RegisterScreen({ navigation }) {
  const { kayitOl } = useAuth();
  const [ad, setAd] = useState('');
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hataMesaji, setHataMesaji] = useState('');

  const kayitOlHandle = async () => {
    setHataMesaji('');
    if (!ad || !email || !sifre) {
      setHataMesaji('HATA: Tüm alanları doldurun!');
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setHataMesaji('HATA: Geçerli bir e-posta girin!');
      return;
    }
    if (sifre.length < 8) {
      setHataMesaji('HATA: Şifre en az 8 karakter olmalıdır!');
      return;
    }
    if (!SIFRE_REGEX.test(sifre)) {
      setHataMesaji('HATA: Şifre büyük harf, küçük harf, rakam ve özel karakter içermelidir!');
      return;
    }

    try {
      setYukleniyor(true);
      setHataMesaji('Kayıt deneniyor...');
      await kayitOl(ad, email, sifre);
      setHataMesaji('Kayıt başarılı! Yönlendiriliyorsunuz...');
    } catch (e) {
      console.error('[RegisterScreen] HATA DETAYI:', JSON.stringify(e, null, 2));
      console.error('[RegisterScreen] Hata string:', String(e));
      console.error('[RegisterScreen] Hata message:', e?.message);
      console.error('[RegisterScreen] Hata response:', e?.response);
      console.error('[RegisterScreen] Hata status:', e?.response?.status);
      console.error('[RegisterScreen] Hata data:', e?.response?.data);

      let mesaj = 'Kayıt başarısız oldu!\n\n';
      mesaj += `Mesaj: ${e?.message || 'Bilinmeyen hata'}\n\n`;
      if (e?.response?.data) {
        mesaj += `Sunucu yanıtı: ${JSON.stringify(e.response.data, null, 2)}`;
      }
      if (e?.response?.status) {
        mesaj += `\n\nHTTP Status: ${e.response.status}`;
      }
      mesaj += '\n\nLütfen tarayıcı konsolundaki (F12) detaylı logları kontrol edin.';
      setHataMesaji(mesaj);
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.icerik}>
        <ScrollView contentContainerStyle={styles.scrollIcerik}>
          <Text style={styles.baslik}>💸 Kayıt Ol</Text>
          <Text style={styles.altBaslik}>Yeni hesap oluştur</Text>

          <TextInput
            style={styles.input}
            placeholder="Ad Soyad"
            placeholderTextColor="#999"
            value={ad}
            onChangeText={setAd}
            autoCapitalize="words"
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

          {hataMesaji ? (
            <View style={[styles.hataKutusu, hataMesaji.includes('başarılı') && styles.basariliKutusu]}>
              <Text style={[styles.hataText, hataMesaji.includes('başarılı') && styles.basariliText]}>
                {hataMesaji}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.btn} onPress={kayitOlHandle} disabled={yukleniyor}>
            <Text style={styles.btnText}>{yukleniyor ? 'Kayıt olunuyor...' : 'Kayıt Ol'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkText}>Zaten hesabın var mı? Giriş yap</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F0F7' },
  icerik: { flex: 1 },
  scrollIcerik: { flexGrow: 1, justifyContent: 'center', padding: 24 },
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
  hataKutusu: {
    backgroundColor: '#FDEDEC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E74C3C',
  },
  basariliKutusu: {
    backgroundColor: '#EAFAF1',
    borderColor: '#2ECC71',
  },
  hataText: {
    color: '#E74C3C',
    fontSize: 14,
    lineHeight: 20,
  },
  basariliText: {
    color: '#2ECC71',
  },
});