import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SummaryBox({ gelir, gider, bakiye }) {
  return (
    <View style={styles.container}>
      <View style={[styles.kutu, styles.bakiyeKutu]}>
        <Text style={styles.bakiyeBaslik}>Toplam Bakiye</Text>
        <Text style={[styles.bakiyeTutar, { color: bakiye >= 0 ? '#2ECC71' : '#E74C3C' }]}>
          {bakiye >= 0 ? '+' : ''}{Number(bakiye).toFixed(2)} ₺
        </Text>
      </View>
      <View style={styles.altSatir}>
        <View style={[styles.kutu, styles.yariKutu]}>
          <Text style={styles.etiket}>⬆️ Gelir</Text>
          <Text style={[styles.tutar, { color: '#2ECC71' }]}>+{Number(gelir).toFixed(2)} ₺</Text>
        </View>
        <View style={[styles.kutu, styles.yariKutu]}>
          <Text style={styles.etiket}>⬇️ Gider</Text>
          <Text style={[styles.tutar, { color: '#E74C3C' }]}>-{Number(gider).toFixed(2)} ₺</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:    { marginBottom: 12 },
  altSatir:     { flexDirection: 'row', gap: 10 },
  kutu:         {
    backgroundColor: '#fff', borderRadius: 14, padding: 12,
    elevation: 3, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6,
  },
  bakiyeKutu:   { marginBottom: 10, alignItems: 'center' },
  bakiyeBaslik: { fontSize: 12, color: '#999', marginBottom: 2 },
  bakiyeTutar:  { fontSize: 28, fontWeight: 'bold' },
  yariKutu:     { flex: 1, alignItems: 'center' },
  etiket:       { fontSize: 12, color: '#999', marginBottom: 2 },
  tutar:        { fontSize: 18, fontWeight: 'bold' },
});