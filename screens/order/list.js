import { useEffect, useState } from 'react';
import { View, Image, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';
import api from '../../lib/api';
import image1 from '../../assets/images/providers/1.png';
import image2 from '../../assets/images/providers/2.png';
import image3 from '../../assets/images/providers/3.png';
import dayjs from 'dayjs';

export default function OrderList() {
  const theme = useTheme();
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const transtus = {
    'PENDING': 'Gözləyir',
    'COMPLETED': 'Ödənildi',
    'REJECTED': 'Ləğv edildi',
  };

  const images = {
    'MOSTBET': image1,
    'MELBET': image2,
    '1XBET': image3,
  };

  const fetchOrders = async () => {
    setRefreshing(true);
    try {
      const res = await api.get('/profile/orders');
      setOrders(res.data);
    } catch (error) {
      console.error(error); // Handle the error appropriately
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: theme.colors.primary }]}>
      <Image style={{ alignSelf: 'center', objectFit: 'cover' , marginBottom: 10}} source={images[item.provider]} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={[styles.title, { color: '#252525' }]}>{item.paymentType}</Text>
        <Text style={[styles.title, { color: '#252525' }]}>{item.amount}₼</Text>
      </View>

      <Divider />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={[styles.description, { color: '#252525' }]}>
          Status: <Text style={[styles.description, { color: '#252525', fontWeight: 'bold' }]}>{transtus[item.status]}</Text>
        </Text>
        <Text style={[styles.description, { color: '#252525', opacity: .5 }]}>
          {dayjs(item.createdAt).format('DD.MM.YYYY - HH:mm')}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{ backgroundColor: '#252525', flex: 1 }}>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.list, { flexGrow: 1 }]} // flexGrow: 1 eklendi
        refreshing={refreshing}
        onRefresh={fetchOrders}
        ListEmptyComponent={<Text style={{ color: 'white', textAlign: 'center' }}>No orders found.</Text>} // Boş liste için gösterim
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 20,
    backgroundColor: '#252525',
  },
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    gap: 4
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
  },
});
