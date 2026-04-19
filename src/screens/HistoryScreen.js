import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  TextInput, StyleSheet, SafeAreaView, Alert
} from 'react-native';
import { useFocusEffect }  from '@react-navigation/native';
import { transactionAPI }  from '../api/client';
import TransactionCard     from '../components/TransactionCard';

const FİLTRELER = ['Tümü', 'Gelir', 'Gider'];

export default function HistoryScreen({ navigation }) {
  const [islemler, setIslemler]     = useState([]);
  const [filtre, setFiltre]         = useState('Tümü');
  const [aramaMetni, setAramaMetni] = useState('');
  const [sayfa, setSayfa]           = useState(1);
  const [toplamSayfa, setToplamSayfa] = useState(1);

  useFocusEffect(useCallback(() => { verileriYukle(1); }, []));

  const verileriYukle = async (sayfaNo = 1) => {
    try {
      const params = {
        page:  sayfaNo,
        limit: 10,
        sortBy: 'tarih',
        sortOrder: 'desc',
      };
      if (filtre === 'Gelir') params.tur = 'gelir';
      if (filtre === 'Gider') params.tur = 'gider';

      const res = await transactionAPI.getAll(params);
      if (sayfaNo === 1) {
        setIslemler(res.data.data);
      } else {
        setIslemler((prev) => [...prev, ...res.data.data]);
      }
      setSayfa(res.data.page);
      setToplamSayfa(res.data.totalPages);
    } catch (e) {
      console.error('Geçmiş yükleme hatası:', e);
    }
  };

  const dahaFazlaYukle = () => {
    if (sayfa < toplamSayfa) verileriYukle(sayfa + 1);
  };

  const islemSil = (item) => {
    Alert.alert('Sil', `"${item.ad}" silinsin mi?`, [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive',
        onPress: async () => {
          await transactionAPI.delete(item._id);
          verileriYukle(1);
        },
      },
    ]);
  };

  const filtreli = islemler.filter((item) => {
    return (
      item.ad.toLowerCase().includes(aramaMetni.toLowerCase()) ||
      item.kategori.toLowerCase().includes(aramaMetni.toLowerCase())
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.ust}>
        <TextInput
          style={styles.aramaKutusu}
          placeholder="🔍 Başlık veya kategori ara..."
          value={aramaMetni}
          onChangeText={setAramaMetni}
        />
        <View style={styles.filtreSatir}>
          {FİLTRELER.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filtreBtn, filtre === f && styles.filtreBtnAktif]}
              onPress={() => { setFiltre(f); verileriYukle(1); }}
            >
              <Text style={[styles.filtreBtnText, filtre === f && styles.filtreBtnTextAktif]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filtreli}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.liste}
        renderItem={({ item }) => (
          <TransactionCard
            item={item}
            onPress={(i) => navigation.navigate('AddEdit', { islem: i })}
            onLongPress={islemSil}
          />
        )}
        onEndReached={dahaFazlaYukle}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={<Text style={styles.bosText}>Hiç işlem bulunamadı 🗒️</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: '#F0F0F7' },
  ust:                { padding: 16, paddingBottom: 0 },
  aramaKutusu:        { backgroundColor: '#fff', borderRadius: 12, padding: 12, fontSize: 15, marginBottom: 12, elevation: 2 },
  filtreSatir:        { flexDirection: 'row', gap: 10, marginBottom: 8 },
  filtreBtn:          { flex: 1, padding: 10, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', elevation: 2 },
  filtreBtnAktif:     { backgroundColor: '#6C63FF' },
  filtreBtnText:      { fontWeight: '600', color: '#555' },
  filtreBtnTextAktif: { color: '#fff' },
  liste:              { padding: 16 },
  bosText:            { textAlign: 'center', color: '#aaa', marginTop: 60, fontSize: 15 },
});