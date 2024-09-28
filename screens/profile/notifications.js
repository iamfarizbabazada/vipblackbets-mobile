import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { View, Image, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import api from '../../lib/api';
import dayjs from 'dayjs';

export default function NotificationList() {
  const theme = useTheme();
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    setRefreshing(true);
    try {
      const res = await api.get('/profile/notifications');
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
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View style={{ gap: 5 }}>
      <Text style={[styles.title, { color: 'black' }]}>{item.title}</Text>
      <Text variant='bodySmall' style={{color: theme.colors.accent}}>{item.body}</Text>
      </View>

        <Text style={[styles.description, { color: theme.colors.descriptions }]}>
          {dayjs(item.createdAt).format('DD.MM.YYYY / HH:mm')}
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
