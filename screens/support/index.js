import { View, Image, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Avatar, Badge, Checkbox, Divider, FAB, Searchbar, Text, useTheme} from 'react-native-paper'
import { Button } from '../../components/button'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';

import { useEffect, useState } from 'react'
import api from '../../lib/api'
import { Ionicons } from '@expo/vector-icons'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
  }),
});


const validationSchema = Yup.object({
  name: Yup.string().required(),
  email: Yup.string().email().required(),
  password: Yup.string().min(8).required(),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Şifreler eşleşmiyor')
    .required('Onay şifresi gereklidir'),
  check: Yup.boolean().isTrue()
})

export default function Support() {
  const navigation = useNavigation()
  const theme = useTheme()
  const [err, setErr] = useState(null)
  const [admins, setAdmins] = useState()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    api.get('/profile/support', {params: {name: searchTerm}}).then(res => setAdmins(res.data))
  }, [searchTerm])

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Chat', {admin: item})} style={[styles.card, ]}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between' }}>
      <View style={{ position: 'relative', flexDirection: 'row', gap: 15, alignItems:'center' }}>
      <View>
      <Avatar.Image
        size={64}
        style={{borderRadius: 16}}
        source={{ uri: item.avatarURL?.toString()}} // Replace with your avatar URL
      />
      {item.isReaded && (
        <Badge
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: theme.colors.accent,
          color: '#ffffff'
        }}
      >
        Yeni
      </Badge>
      )}
      </View>
        <View>
        <Text style={{textTransform: 'capitalize', fontSize: 18, opacity: .5}}>{item.name}</Text>
        {/* <Text style={{color: theme.colors.description, width: '80%'}}>{item.lastMessage}</Text> */}
        </View>
    </View>
      </View>
    </TouchableOpacity>
  );

  return (
      <View style={styles.container}>
        <View style={styles.actionContainer}>
          <Searchbar placeholder='Axtar' placeholderTextColor={theme.colors.accent} style={{backgroundColor: '#353433', borderRadius: 10}} iconColor={theme.colors.accent} value={searchTerm} onChangeText={setSearchTerm} />
          
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <Ionicons name='headset' size={24} color={theme.colors.primary} />
            <Text variant='titleLarge' style={{color: theme.colors.primary, marginVertical: 10}}>Canlı Dəstək</Text>
          </View>
          <Divider style={{marginTop: 15}} />

          <FlatList
            data={admins}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            // refreshing={refreshing}
            // onRefresh={fetchOrders}
          />
        </View>
        <FAB
          icon={() => <Ionicons name="paper-plane" size={24} color="white" />}
          label='Telegram Dəstək'
          style={[styles.fab, {backgroundColor: theme.colors.accent}]}
          onPress={() => Linking.openURL('tg://resolve?domain=farizbabazada')}
        />
      </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252525',
  },
  list: {
    flex: 1,
    backgroundColor: '#252525',
  },
  card: {
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  image: {
    width: '100%',
    height: '40%'
  },
  actionContainer: {
    flex: 1,
    padding: 20,
    gap: 10,
  },
  display: {
    gap: 10,
    marginBottom: 20
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});