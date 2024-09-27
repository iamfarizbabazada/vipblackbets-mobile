import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { View, Image, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
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
    'PENDING': 'İcrada',
    'COMPLETED': 'Uğurlu',
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
      <Image style={{ alignSelf: 'center', objectFit: 'cover' }} source={images[item.provider]} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={[styles.title, { color: 'black' }]}>{item.paymentType}</Text>
        <Text style={[styles.title, { color: 'black' }]}>{item.amount}₼</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={[styles.description, { color: theme.colors.descriptions }]}>
          {dayjs(item.createdAt).format('DD.MM.YYYY / HH:mm')}
        </Text>
        <Text style={[styles.description, { color: theme.colors.descriptions }]}>
          Status: {transtus[item.status]}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={{backgroundColor: '#252525', flex: 1}}>
      <FlatList
      data={orders}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
      refreshing={refreshing}
      onRefresh={fetchOrders}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    padding: 16,
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
    gap: 20
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
  },
});
