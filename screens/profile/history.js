import React from 'react';
import { FlatList, View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; // Örnek olarak Ionicons kullanıyoruz
import { useNavigation } from '@react-navigation/native';
import { Text, useTheme } from 'react-native-paper';

const menuData = [
  { id: '1', name: 'Balans Tarixçəsi', icon: 'dollar-sign', to: 'BalanceList' },
  { id: '2', name: 'Depozitlərim', icon: 'upload', to: 'DepositList' },
  { id: '3', name: 'Çıxarışlarım', icon: 'download', to: 'WithdrawList' },
  // Menü öğelerini buraya ekleyebilirsin
];

const MenuItem = ({ item }) => {
  const navigation = useNavigation(); // Gezinme hook'u
  const theme = useTheme()

  return (
    <TouchableOpacity onPress={() => navigation.navigate(item.to)}>
      <View style={styles.menuItem}>
        <Icon name={item.icon} size={24} color={item.to == 'DeleteProfile' ? theme.colors.accent : theme.colors.primary} />
        <Text variant='titleMedium' style={{color: item.to == 'DeleteProfile' ? theme.colors.accent : theme.colors.primary}}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );
};

const HistoryProfile = () => {
  return (
    <View style={{flex: 1, backgroundColor: '#252525'}}>
      <FlatList
        contentContainerStyle={{padding: 20}}
        data={menuData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MenuItem item={item} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 10,
    borderBottomWidth: .2,
    borderBottomColor: '#71727A'
  },
})

export default HistoryProfile;
