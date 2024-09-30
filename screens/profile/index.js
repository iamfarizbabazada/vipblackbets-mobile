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
      name: 'Şifrəni Yenilə',
      to: 'Security'
    },
    {
      name: 'Şərtlər & Qaydalar',
      to: 'Terms'
    },
    {
      name: 'Gizlilik Siyasəti',
      to: 'Privacy'
    },
  ]

  useEffect(() => {
    fetchUser()
  }, [])

  if(!user) return <View></View>

  return (
      <View style={styles.container}>
        <View style={styles.info}>
          <Avatar.Image style={{borderRadius: 16}} size={100} source={{ uri: user.avatarURL}} />
          
          <View style={{gap: 8}}>
            <Text variant='titleLarge' style={{color: theme.colors.primary}}>{user.name}</Text>
            <Text variant='bodySmall' style={{color: theme.colors.description}}>{user.email}</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.menu}>
          {menu.map((item, idx) => (
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate(item.to)} key={idx}>
              <Text variant='titleMedium' style={{color: theme.colors.primary}}>{item.name}</Text>
              {/* <Ionicons name='chevron-forward' color={theme.colors.primary} style={{opacity: .5}} size={24} /> */}
            </TouchableOpacity>
          ))}

            <TouchableOpacity style={styles.menuItem} onPress={showDialog}>
              <Text variant='titleMedium' style={{color: theme.colors.primary}}>Hesabdan Çıx</Text>
              {/* <Ionicons name='chevron-forward' color={theme.colors.primary} style={{opacity: .5}} size={24} /> */}
            </TouchableOpacity>

            <Text style={{paddingVertical: 18, opacity: .5}}>Versiya: 1.2.2</Text>
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
    padding: 30,
    paddingTop: 50,
    backgroundColor: '#252525'
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    borderWidth: 1,
    padding: 20,
    borderRadius: 16,
    borderColor: '#B8860B'
  },
  menu: {
    marginTop: 50,
    marginBottom: 10,
  },
  menuItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: .2,
    borderBottomColor: '#B8860B',
  }
});