import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { useFocusEffect }  from '@react-navigation/native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { transactionAPI }  from '../api/client';
import SummaryBox          from '../components/SummaryBox';

const EKRAN = Dimensions.get('window').width;
const RENKLER = ['#6C63FF', '#E74C3C', '#2ECC71', '#F39C12', '#3498DB', '#9B59B6'];
const AY_ADLARI = ['', 'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

export default function ReportScreen() {
  const [ozet, setOzet]     = useState({ gelir: 0, gider: 0, bakiye: 0 });
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState(null);
  const ay  = new Date().getMonth() + 1;
  const yil = new Date().getFullYear();

  useFocusEffect(useCallback(() => { verileriYukle(); }, []));

  const verileriYukle = async () => {
    try {
      const res    = await transactionAPI.getAll({ limit: 1000 });
      const hepsi  = res.data.data;

      const ayStr      = String(ay).padStart(2, '0');
      const buAy       = hepsi.filter((t) => t.tarih.startsWith(`${yil}-${ayStr}`));
      const gelir      = buAy.filter((t) => t.tur === 'gelir').reduce((a, t) => a + t.tutar, 0);
      const gider      = buAy.filter((t) => t.tur === 'gider').reduce((a, t) => a + t.tutar, 0);
      setOzet({ gelir, gider, bakiye: gelir - gider });

      // Pasta grafik
      const giderler = buAy.filter((t) => t.tur === 'gider');
      const gruplar  = {};
      giderler.forEach((t) => { gruplar[t.kategori] = (gruplar[t.kategori] || 0) + t.tutar; });
      const pie = Object.keys(gruplar).map((kat, i) => ({
        name: kat, tutar: gruplar[kat],
        color: RENKLER[i % RENKLER.length],
        legendFontColor: '#555', legendFontSize: 13,
      }));
      setPieData(pie);

      // Bar grafik — son 6 ay
      const labels = [], gelirler = [], giderVerisi = [];
      for (let i = 5; i >= 0; i--) {
        let hAy = ay - i, hYil = yil;
        if (hAy <= 0) { hAy += 12; hYil -= 1; }
        const hAyStr = String(hAy).padStart(2, '0');
        const ayIslemleri = hepsi.filter((t) => t.tarih.startsWith(`${hYil}-${hAyStr}`));
        labels.push(AY_ADLARI[hAy].substring(0, 3));
        gelirler.push(ayIslemleri.filter((t) => t.tur === 'gelir').reduce((a, t) => a + t.tutar, 0));
        giderVerisi.push(ayIslemleri.filter((t) => t.tur === 'gider').reduce((a, t) => a + t.tutar, 0));
      }
      setBarData({ labels, gelirler, giderVerisi });
    } catch (e) {
      console.error('Rapor yükleme hatası:', e);
    }
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff', backgroundGradientTo: '#fff',
    color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
    labelColor: () => '#555', decimalPlaces: 0, barPercentage: 0.6,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.icerik}>
        <Text style={styles.baslik}>📅 {AY_ADLARI[ay]} {yil} Raporu</Text>
        <SummaryBox gelir={ozet.gelir} gider={ozet.gider} bakiye={ozet.bakiye} />

        <View style={styles.kutu}>
          <Text style={styles.kutuBaslik}>🧩 Gider Dağılımı</Text>
          {pieData.length > 0 ? (
            <PieChart data={pieData} width={EKRAN - 32} height={200}
              chartConfig={chartConfig} accessor="tutar" backgroundColor="transparent" paddingLeft="16" />
          ) : (
            <Text style={styles.bosText}>Bu ay gider kaydı yok.</Text>
          )}
        </View>

        {barData && (
          <View style={styles.kutu}>
            <Text style={styles.kutuBaslik}>📊 Son 6 Ay Karşılaştırma</Text>
            <Text style={styles.altBaslik}>Gelir</Text>
            <BarChart
              data={{ labels: barData.labels, datasets: [{ data: barData.gelirler }] }}
              width={EKRAN - 32} height={180}
              chartConfig={{ ...chartConfig, color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})` }}
              style={styles.bar} showValuesOnTopOfBars fromZero
            />
            <Text style={styles.altBaslik}>Gider</Text>
            <BarChart
              data={{ labels: barData.labels, datasets: [{ data: barData.giderVerisi }] }}
              width={EKRAN - 32} height={180}
              chartConfig={{ ...chartConfig, color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})` }}
              style={styles.bar} showValuesOnTopOfBars fromZero
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#F0F0F7' },
  icerik:     { padding: 16 },
  baslik:     { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  kutu:       { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 3 },
  kutuBaslik: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  altBaslik:  { fontSize: 13, fontWeight: '600', color: '#888', marginTop: 12, marginBottom: 4 },
  bar:        { borderRadius: 12 },
  bosText:    { textAlign: 'center', color: '#aaa', paddingVertical: 20 },
});