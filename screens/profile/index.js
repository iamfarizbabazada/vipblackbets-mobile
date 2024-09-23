import { View, Image, StyleSheet, Alert, ScrollView, TouchableWithoutFeedback, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Avatar, Dialog, Portal, Text, useTheme} from 'react-native-paper'
import { Button } from '../../components/button'

import { useAuthStore } from '../../store/auth'
import { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'


export default function Profile() {
  const navigation = useNavigation()
  const theme = useTheme()
  const { user, fetchUser, logout } = useAuthStore()
  
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const handleLogout = async () => {
    try {
      await logout()
      hideDialog()
    } catch(err) {
      console.error(err.response?.data)
    }
  }

  const menu = [
    {
      name: 'Hesab Məlumatları',
      to: 'UpdateProfile'
    },
    {
      name: 'Depozit Yüklə',
      to: 'OrderCreate'
    },
    {
      name: 'Ödəniş Tarixçəsi',
      to: 'OrderList'
    },
    {
      name: 'Bildirişlər',
      to: 'Home'
    },
    {
      name: 'Təhlükəsizlik',
      to: 'Security'
    },
    {
      name: 'Şərtlər & Qaydalar',
      to: 'Home'
    },
    {
      name: 'Gizlilik Siyasəti',
      to: 'Home'
    },
  ]

  useEffect(() => {
    fetchUser()
  }, [])

  if(!user) return <View></View>

  const userLabel = user.name.split(' ')

  return (
      <View style={styles.container}>
        <View style={styles.info}>
          {user.avatarURL ? <Avatar.Image style={{borderRadius: 45}} size={100} source={{ uri: user.avatarURL, headers: {
            method: 'POST',
            headers: {
              Pragma: 'no-cache',
            },
          } }} /> : <Avatar.Text style={{borderRadius: 45}} labelStyle={{textTransform: 'uppercase'}} size={100} label={`${userLabel[0][0]}${userLabel[1][1]}`} /> }
          
          <Text variant='titleLarge'>{user.name}</Text>
          <Text variant='bodySmall' style={{color: theme.colors.description}}>{user.email}</Text>
        </View>

        <ScrollView style={styles.menu}>
          {menu.map((item, idx) => (
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate(item.to)} key={idx}>
              <Text variant='titleMedium' style={{color: theme.colors.primary}}>{item.name}</Text>
              <Ionicons name='chevron-forward' color={theme.colors.primary} size={24} />
            </TouchableOpacity>
          ))}

            <TouchableOpacity style={styles.menuItem} onPress={showDialog}>
              <Text variant='titleMedium' style={{color: theme.colors.primary}}>Hesabdan Çıx</Text>
              <Ionicons name='chevron-forward' color={theme.colors.primary} size={24} />
            </TouchableOpacity>
        </ScrollView>


        <Portal>
          <Dialog style={{backgroundColor: '#252525'}} visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Hesabdan Çıxış</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">Hesabınızdan çıxmaq istədiyinizə əminsinizmi?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button textColor={theme.colors.accent} onPress={hideDialog}>Ləğv et</Button>
              <Button onPress={handleLogout}>Çıxış et</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#252525'
  },
  info: {
    alignItems: 'center',
    gap: 5
  },
  menu: {
    marginTop: 50,
    marginBottom: 10
  },
  menuItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#7B5506',
  }
});