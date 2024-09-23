import { View, Image, StyleSheet, Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Checkbox, Text, useTheme} from 'react-native-paper'
import { Button } from '../components/button'
import { Input, Password } from '../components/input'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import * as Notifications from 'expo-notifications';

import { useAuthStore } from '../store/auth'
import { useState } from 'react'

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

export default function Register() {
  const navigation = useNavigation()
  const theme = useTheme()
  const { register, logout } = useAuthStore()
  const [err, setErr] = useState(null)
  
  const formik = useFormik({
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await register(values)
        navigation.navigate('RegisterVerify', {email: values.email})
      } catch(err) {
        setErr(err.response?.data?.message)
      }
    },
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmpassword: '',
      check: false
    }
  })

  return (
      <View style={styles.container}>
        <View style={styles.actionContainer}>
        </View>
      </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});