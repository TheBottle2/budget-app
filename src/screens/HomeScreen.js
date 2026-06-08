import React, { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { transactionAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import SummaryBox from '../components/SummaryBox';
import TransactionCard from '../components/TransactionCard';

const AY_ADLARI = ['', 'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

function tarihAyYil(tarihStr) {
  if (!tarihStr) return { yil: 0, ay: 0 };
  const d = new Date(tarihStr);
  if (isNaN(d.getTime())) return { yil: 0, ay: 0 };
  return { yil: d.getFullYear(), ay: d.getMonth() + 1 };
}

export default function HomeScreen({ navigation }) {
  const { kullanici, cikisYap } = useAuth();
  const [islemler, setIslemler] = useState([]);
  const [ozet, setOzet] = useState({ gelir: 0, gider: 0, bakiye: 0 });
  const [ay, setAy] = useState(new Date().getMonth() + 1);
  const [yil, setYil] = useState(new Date().getFullYear());

  useFocusEffect(useCallback(() => { verileriYukle(); }, [ay, yil]));

  const verileriYukle = async () => {
    try {
      const res = await transactionAPI.getAll({ limit: 100 });
      const hepsi = res.data.data;
      const filtreliAy = hepsi.filter((t) => {
        const { yil: tYil, ay: tAy } = tarihAyYil(t.tarih);
        return tYil === yil && tAy === ay;
      });

      setIslemler(filtreliAy.slice(0, 10));

      const gelir = filtreliAy.filter((t) => t.tur === 'gelir').reduce((a, t) => a + t.tutar, 0);
      const gider = filtreliAy.filter((t) => t.tur === 'gider').reduce((a, t) => a + t.tutar, 0);
      setOzet({ gelir, gider, bakiye: gelir - gider });
    } catch (e) {
      console.error('Veri yükleme hatası:', e);
      Alert.alert('Hata', 'Veriler yüklenemedi.');
    }
  };

  const ayGeri = () => { if (ay === 1) { setAy(12); setYil(yil - 1); } else setAy(ay - 1); };
  const ayIleri = () => { if (ay === 12) { setAy(1); setYil(yil + 1); } else setAy(ay + 1); };

  const islemSil = async (item) => {
    Alert.alert('Sil', `"${item.ad}" silinsin mi?`, [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive', onPress: async () => {
          try {
            await transactionAPI.delete(item._id);
            verileriYukle();
          } catch (e) {
            Alert.alert('Hata', e.response?.data?.mesaj || 'Silme başarısız!');
          }
        },
      },
    ]);
  };

  const cikisOnay = () => {
    Alert.alert('Çıkış', 'Çıkış yapmak istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      { text: 'Çıkış', style: 'destructive', onPress: async () => {
        try {
          await cikisYap();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        } catch (e) {
          console.error('Çıkış hatası:', e);
          Alert.alert('Hata', 'Çıkış yapılamadı.');
        }
      }},
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#6C63FF" />
      <View style={styles.header}>
        <Text style={styles.headerBaslik}>💸 Bütçe Yöneticisi</Text>
        <TouchableOpacity onPress={cikisOnay}>
          <Text style={styles.cikisBtn}>Çıkış</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.aySecici}>
        <TouchableOpacity onPress={ayGeri} style={styles.ayBtn}>
          <Text style={styles.ayBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.ayMetin}>{AY_ADLARI[ay]} {yil}</Text>
        <TouchableOpacity onPress={ayIleri} style={styles.ayBtn}>
          <Text style={styles.ayBtnText}>›</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={islemler}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.liste}
        ListHeaderComponent={
          <>
            <SummaryBox gelir={ozet.gelir} gider={ozet.gider} bakiye={ozet.bakiye} />
            <View style={styles.listBaslikSatir}>
              <Text style={styles.listBaslik}>Son İşlemler</Text>
              <TouchableOpacity onPress={() => navigation.navigate('History')}>
                <Text style={styles.tumunuGor}>Tümünü Gör →</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <TransactionCard
            item={item}
            onPress={(i) => navigation.navigate('AddEdit', { islem: i })}
            onLongPress={islemSil}
          />
        )}
        ListEmptyComponent={<Text style={styles.bosText}>Bu ay henüz işlem yok</Text>}
      />

      <TouchableOpacity style={styles.ekleBtn} onPress={() => navigation.navigate('AddEdit', {})}>
        <Text style={styles.ekleBtnText}>+ Yeni İşlem</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F0F7' },
  header: { backgroundColor: '#6C63FF', padding: 10, paddingTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerBaslik: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  cikisBtn: { color: '#fff', fontSize: 12, opacity: 0.8 },
  aySecici: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#6C63FF', paddingBottom: 10 },
  ayBtn: { paddingHorizontal: 14 },
  ayBtnText: { color: '#fff', fontSize: 24, fontWeight: '300' },
  ayMetin: { color: '#fff', fontSize: 15, fontWeight: '600', minWidth: 130, textAlign: 'center' },
  liste: { padding: 10 },
  listBaslikSatir: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  listBaslik: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  tumunuGor: { fontSize: 12, color: '#6C63FF', fontWeight: '600' },
  bosText: { textAlign: 'center', color: '#aaa', marginTop: 24, fontSize: 13 },
  ekleBtn: { backgroundColor: '#6C63FF', margin: 10, borderRadius: 12, padding: 12, alignItems: 'center' },
  ekleBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});
