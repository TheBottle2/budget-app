import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert
} from 'react-native';
import { transactionAPI } from '../api/client';

const GELIR_KATEGORILERI = ['Maaş', 'Ek Gelir', 'Diğer'];
const GIDER_KATEGORILERI = ['Market', 'Ulaşım', 'Fatura', 'Sağlık', 'Eğlence', 'Restoran', 'Diğer'];
const TARIH_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export default function AddEditScreen({ navigation, route }) {
  const mevcutIslem = route.params?.islem;

  const [ad, setAd] = useState(mevcutIslem?.ad || '');
  const [tutar, setTutar] = useState(mevcutIslem?.tutar?.toString() || '');
  const [tur, setTur] = useState(mevcutIslem?.tur || 'gider');
  const [kategori, setKategori] = useState(mevcutIslem?.kategori || '');
  const initTarih = mevcutIslem?.tarih
    ? new Date(mevcutIslem.tarih).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0];
  const [tarih, setTarih] = useState(initTarih);
  const [not, setNot] = useState(mevcutIslem?.not || '');
  const [yukleniyor, setYukleniyor] = useState(false);

  const kategoriler = tur === 'gelir' ? GELIR_KATEGORILERI : GIDER_KATEGORILERI;

  const kaydet = async () => {
    if (!ad || !tutar || !kategori) return Alert.alert('Hata', 'Zorunlu alanları doldurun!');
    const tutarNum = Number(tutar);
    if (isNaN(tutarNum) || tutarNum <= 0) return Alert.alert('Hata', 'Geçerli bir tutar girin!');
    if (!TARIH_REGEX.test(tarih)) return Alert.alert('Hata', 'Tarih formatı YYYY-AA-GG olmalıdır!');

    try {
      setYukleniyor(true);
      const data = { ad, tutar: tutarNum, tur, kategori, tarih, not };
      if (mevcutIslem) {
        await transactionAPI.patch(mevcutIslem._id, data);
      } else {
        await transactionAPI.create(data);
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Hata', e.response?.data?.mesaj || 'İşlem kaydedilemedi!');
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>İşlem Türü</Text>
      <View style={styles.turSatir}>
        {['gider', 'gelir'].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.turBtn, tur === t && (t === 'gelir' ? styles.turGelirAktif : styles.turGiderAktif)]}
            onPress={() => { setTur(t); setKategori(''); }}
          >
            <Text style={[styles.turBtnText, tur === t && styles.turBtnTextAktif]}>
              {t === 'gelir' ? '⬆️ Gelir' : '⬇️ Gider'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Başlık</Text>
      <TextInput style={styles.input} placeholder="Örn: Migros alışverişi" value={ad} onChangeText={setAd} maxLength={100} />

      <Text style={styles.label}>Tutar (₺)</Text>
      <TextInput style={styles.input} placeholder="0.00" value={tutar} onChangeText={setTutar} keyboardType="decimal-pad" />

      <Text style={styles.label}>Kategori</Text>
      <View style={styles.kategoriSatir}>
        {kategoriler.map((kat) => (
          <TouchableOpacity
            key={kat}
            style={[styles.kategoriBtn, kategori === kat && styles.kategoriBtnAktif]}
            onPress={() => setKategori(kat)}
          >
            <Text style={[styles.kategoriBtnText, kategori === kat && styles.kategoriBtnTextAktif]}>{kat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Tarih (YYYY-AA-GG)</Text>
      <TextInput style={styles.input} placeholder="2025-03-15" value={tarih} onChangeText={setTarih} maxLength={10} />

      <Text style={styles.label}>Not (isteğe bağlı)</Text>
      <TextInput style={[styles.input, styles.notInput]} placeholder="Not..." value={not} onChangeText={setNot} multiline textAlignVertical="top" maxLength={500} />

      <TouchableOpacity
        style={[styles.kaydetBtn, { backgroundColor: tur === 'gelir' ? '#2ECC71' : '#E74C3C' }]}
        onPress={kaydet}
        disabled={yukleniyor}
      >
        <Text style={styles.kaydetBtnText}>{yukleniyor ? 'Kaydediliyor...' : mevcutIslem ? '✏️ Güncelle' : '💾 Kaydet'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F0F7', padding: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 6, marginTop: 14 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 14, fontSize: 16, elevation: 2 },
  notInput: { height: 100 },
  turSatir: { flexDirection: 'row', gap: 12 },
  turBtn: { flex: 1, padding: 14, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', elevation: 2 },
  turGelirAktif: { backgroundColor: '#2ECC71' },
  turGiderAktif: { backgroundColor: '#E74C3C' },
  turBtnText: { fontSize: 16, fontWeight: '600', color: '#555' },
  turBtnTextAktif: { color: '#fff' },
  kategoriSatir: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  kategoriBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#ddd' },
  kategoriBtnAktif: { backgroundColor: '#6C63FF' },
  kategoriBtnText: { color: '#555', fontWeight: '600' },
  kategoriBtnTextAktif: { color: '#fff' },
  kaydetBtn: { borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 28, marginBottom: 40 },
  kaydetBtnText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
});
