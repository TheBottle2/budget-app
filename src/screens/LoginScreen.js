import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useAuth } from '../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen({ navigation }) {
  const { girisYap } = useAuth();
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hataMesaji, setHataMesaji] = useState('');

  const girisYapHandle = async () => {
    setHataMesaji('');
    if (!email || !sifre) {
      setHataMesaji('HATA: Tüm alanları doldurun!');
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setHataMesaji('HATA: Geçerli bir e-posta girin!');
      return;
    }

    try {
      setYukleniyor(true);
      setHataMesaji('Giriş deneniyor...');
      await girisYap(email, sifre);
      setHataMesaji('Giriş başarılı! Yönlendiriliyorsunuz...');
    } catch (e) {
      console.error('[LoginScreen] HATA DETAYI:', JSON.stringify(e, null, 2));
      console.error('[LoginScreen] Hata response:', e?.response?.data);
      console.error('[LoginScreen] Hata status:', e?.response?.status);

      let mesaj = 'Giriş başarısız oldu!\n\n';
      mesaj += `Mesaj: ${e?.message || 'Bilinmeyen hata'}\n\n`;
      if (e?.response?.data) {
        mesaj += `Sunucu yanıtı: ${JSON.stringify(e.response.data)}`;
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

          {hataMesaji ? (
            <View style={[styles.hataKutusu, hataMesaji.includes('başarılı') && styles.basariliKutusu]}>
              <Text style={[styles.hataText, hataMesaji.includes('başarılı') && styles.basariliText]}>
                {hataMesaji}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.btn} onPress={girisYapHandle} disabled={yukleniyor}>
            <Text style={styles.btnText}>{yukleniyor ? 'Giriş yapılıyor...' : 'Giriş Yap'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.linkText}>Hesabın yok mu? Kayıt ol</Text>
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