import { View, Image, StyleSheet, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Dialog, Divider, Portal, Text, useTheme} from 'react-native-paper'
import { Button } from '../../components/button'
import { Input, Password } from '../../components/input'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { useAuthStore } from '../../store/auth'
import { useState } from 'react'
import api from '../../lib/api'
import { Ionicons } from '@expo/vector-icons'

const validationSchema = Yup.object({
  oldPassword: Yup.string().min(8),
  newPassword: Yup.string().min(8),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Şifreler eşleşmiyor')
    .required('Onay şifresi gereklidir'),
})

export default function Security() {
  const navigation = useNavigation()
  const theme = useTheme()
  const { user, fetchUser, delete: deleteUser } = useAuthStore()
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)

  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);
  
  const formik = useFormik({
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true)
      try {
        await api.patch('/profile/change-password', {oldPassword: values.oldPassword, newPassword: values.newPassword})
        await fetchUser()
        navigation.navigate('ProfileList')
      } catch(err) {
        setErr(err.response?.data?.message)
      }
      setLoading(false)
    },
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmpassword: ''
    }
  })

  const handleDelete = async () => {
    try {
      await deleteUser('/profile')
      hideDialog()
    } catch(err) {
      console.error(err)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.display}>

          <View style={{gap: 15, marginBottom: 15}}>
            <Password error={formik.errors.oldPassword} label="Mövcud Şifrə" value={formik.values.oldPassword} onChangeText={formik.handleChange('oldPassword')}  />
            <Password error={formik.errors.newPassword} label="Yeni Şifrə" value={formik.values.newPassword} onChangeText={formik.handleChange('newPassword')} />
            <Password error={formik.errors.confirmpassword} label="Yeni Şifrənin Təkrarı" value={formik.values.confirmpassword} onChangeText={formik.handleChange('confirmpassword')} />
          </View>

          <Divider />

          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Button icon={() => <Ionicons name='trash' size={18} color="#FC583F" />} textColor='#FC583F' onPress={showDialog}>Hesabımı sil</Button>
          </View>
      </View>

      <Button mode='contained' loading={loading} onPress={formik.handleSubmit}>
        Şifrəni Yenilə
      </Button>


      <Portal>
          <Dialog style={{backgroundColor: '#252525'}} visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Hesabı Sil</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">Hesabınızı silib və çıxmaq istədiyinizə əminsinizmi?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button textColor={theme.colors.accent} onPress={hideDialog}>Ləğv et</Button>
              <Button onPress={handleDelete}>Sil</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#252525',
    justifyContent: 'space-between'
  },
  image: {
    width: '100%',
    height: '40%'
  },
  display: {
    gap: 10,
    marginBottom: 20
  },
});