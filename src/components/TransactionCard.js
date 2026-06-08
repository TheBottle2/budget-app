import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const IKONLAR = {
  Market: '🛒', Ulaşım: '🚌', Fatura: '💡', Sağlık: '💊',
  Eğlence: '🎮', Restoran: '🍽️', Maaş: '💼', 'Ek Gelir': '💰', Diğer: '📦',
};

export default function TransactionCard({ item, onPress, onLongPress }) {
  const isGelir = item.tur === 'gelir';
  const ikon    = IKONLAR[item.kategori] || '📦';

  return (
    <TouchableOpacity
      style={styles.kart}
      onPress={() => onPress(item)}
      onLongPress={() => onLongPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.sol}>
        <View style={[styles.ikonKutu, { backgroundColor: isGelir ? '#EAFAF1' : '#FDEDEC' }]}>
          <Text style={styles.ikon}>{ikon}</Text>
        </View>
        <View style={styles.bilgi}>
          <Text style={styles.baslik} numberOfLines={1}>{item.ad}</Text>
          <Text style={styles.alt}>{item.kategori} • {item.tarih ? new Date(item.tarih).toLocaleDateString('tr-TR') : ''}</Text>
        </View>
      </View>
      <Text style={[styles.tutar, { color: isGelir ? '#2ECC71' : '#E74C3C' }]}>
        {isGelir ? '+' : '-'}{Number(item.tutar).toFixed(2)} ₺
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  kart:     {
    backgroundColor: '#fff', borderRadius: 12, padding: 12,
    marginBottom: 8, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', elevation: 2,
  },
  sol:      { flexDirection: 'row', alignItems: 'center', flex: 1 },
  ikonKutu: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  ikon:     { fontSize: 20 },
  bilgi:    { flex: 1 },
  baslik:   { fontSize: 14, fontWeight: '600', color: '#333' },
  alt:      { fontSize: 11, color: '#999', marginTop: 2 },
  tutar:    { fontSize: 15, fontWeight: 'bold', marginLeft: 8 },
});